import { StyleSheet, Button, Alert, TextInput } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from './interface/expense';
import { useState } from 'react';

export default function EditExpenseScreen() {
  const router = useRouter();
  const { expense } = useLocalSearchParams();
  const parsedExpense = expense ? JSON.parse(expense as string) : null;

  const [name, setName] = useState(parsedExpense ? parsedExpense.name : '');
  const [amount, setAmount] = useState(
    parsedExpense ? parsedExpense.amount.toString() : ''
  );

  const handleSave = async () => {
    if (!name || !amount) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];

      const newExpense = parsedExpense
        ? { ...parsedExpense, name, amount: parseFloat(amount) }
        : {
            id: Date.now().toString(),
            name,
            amount: parseFloat(amount),
          };

      const updatedExpenses = parsedExpense
        ? expenses.map((exp: Expense) =>
            exp.id === parsedExpense.id ? newExpense : exp
          )
        : [...expenses, newExpense];

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      Alert.alert('Sucesso', 'Despesa salva com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar a despesa.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!parsedExpense) return;

    try {
      const existingExpenses = await AsyncStorage.getItem('expenses');
      const expenses = existingExpenses ? JSON.parse(existingExpenses) : [];

      const updatedExpenses = expenses.filter(
        (exp: Expense) => exp.id !== parsedExpense.id
      );

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      Alert.alert('Sucesso', 'Despesa excluída com sucesso!');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a despesa.');
      console.error(error);
    }
  };

  return (
    <ThemedView style={{ padding: 20 }}>
      <ThemedText>Descrição:</ThemedText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Descrição da despesa"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <ThemedText>Valor:</ThemedText>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Valor da despesa"
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button
        title={parsedExpense ? 'Editar' : 'Adicionar'}
        onPress={handleSave}
      />

      {parsedExpense && (
        <Button title="Excluir" onPress={handleDelete} color="red" />
      )}
    </ThemedView>
  );
}
