import React, { useState } from 'react'
import { Text, View, SafeAreaView } from "@/components";
import { Header } from '@/components/Header'
import { useColors } from '@/hooks/useColors'
import { ScrollView } from 'react-native'
import { VisitCard } from '@/components/VisitCard'
import { FlatList } from 'react-native'
import { CreateNewVisit } from '@/components/CreateNewVisit';

const data = [
  {
    id: "123", 
    name: "Visit Accounting Office", 
    description: "I want to pay all of my school fees, tuition, uniform",
    visiting: "Cashier",
    secured: true,
    status: "pending"
  },
  {
    id: "1234", 
    name: "Enroll", 
    description: "I want to enroll my son to grade 11.",
    visiting: "Admission Office",
    secured: true,
    status: "approved"
  },
  {
    id: "12346", 
    name: "test", 
    description: "test description",
    visiting: "Cashier",
    secured: false,
    status: "pending"
  },
  {
    id: "1235", 
    name: "test", 
    description: "test description",
    visiting: "Cashier",
    secured: true,
    status: "pending"
  },
]

export default function Main() {
  const colors = useColors();
  const [createnew, setCreateNew] = useState(false);
  return (
    <SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header />
        <CreateNewVisit visible={createnew} onClose={() => setCreateNew(false)} />
        <View style={{
          paddingVertical: 20,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Text type="semibold">My Gatepass</Text>
          <Text type="link" onPress={() => setCreateNew(true)}>Create Pass</Text>
        </View>

        <View style={{
          marginHorizontal: 20
        }}>
          <FlatList
          contentContainerStyle={{
            gap: 8
          }}
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({item}) => (
              <VisitCard 
                id={item.id}
                name={item.name}
                description={item.description}
                visiting={item.visiting}
                status={item.status}
                secured={item.secured}
               />
            )}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
