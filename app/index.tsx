import { StyleSheet, FlatList, Button } from 'react-native';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Expense } from './interface/expense';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem('expenses');
        if (storedExpenses) {
          setExpenses(JSON.parse(storedExpenses));
        }
      } catch (error) {
        console.error('Erro ao carregar as despesas:', error);
      }
    };

    loadExpenses();
  }, [expenses]);

  return (
    <ThemedView>
      <FlatList
        data={expenses}
        keyExtractor={(item: Expense) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={{ padding: 10 }}>
            <ThemedText>{item.name}</ThemedText>
            <ThemedText>R$ {item.amount}</ThemedText>
            <Button
              title="Editar"
              onPress={() =>
                router.push({
                  pathname: '/editExpense',
                  params: { expense: JSON.stringify(item) },
                })
              }
            />
          </ThemedView>
        )}
      />
      <Button
        title="Adicionar Despesa"
        onPress={() => router.push('/editExpense')}
      />
    </ThemedView>
  );
}
