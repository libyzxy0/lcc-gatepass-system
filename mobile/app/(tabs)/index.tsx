import React, { useState } from 'react'
import { Text, View, SafeAreaView } from "@/components";
import { Header } from '@/components/Header'
import { useColors } from '@/hooks/useColors'
import { VisitCard } from '@/components/VisitCard'
import { FlatList } from 'react-native'
import { CreateNewVisit } from '@/components/CreateNewVisit';

const data = [
  {
    id: "123", 
    name: "Im Paying to Cashier", 
    description: "I want to pay all of my school fees, tuition, uniform, fieldtrip.",
    visiting: "Cashier",
    secured: true,
    status: "approved"
  },
  {
    id: "1234", 
    name: "Enroll", 
    description: "I want to enroll my son to grade 11.",
    visiting: "Admission",
    secured: true,
    status: "completed"
  },
  {
    id: "12346", 
    name: "Im getting the card of my child.", 
    description: "Im going to get my childs' card to see my childs grades.",
    visiting: "Jay Pineda",
    secured: false,
    status: "approved"
  },
  {
    id: "1235", 
    name: "Sign Clearance", 
    description: "Im requesting to sign my clearance.",
    visiting: "Accounting",
    secured: true,
    status: "rejected"
  },
]

export default function Main() {
  const colors = useColors();
  const [createnew, setCreateNew] = useState(false);
  return (
    <SafeAreaView>
      <View>
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
      </View>
    </SafeAreaView>
  );
}
