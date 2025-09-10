import React, { useState, useEffect } from "react";
import { View, ScrollView } from "react-native";
import TableCard from "@/components/molecules/TableCard";
import {
  createTable,
  getTables,
  Table,
  patchTable,
  deleteTable,
} from "@/services/table";
import useRestaurant from "@/hooks/useRestaurant";
import Title from "@/components/atoms/Title";
import { useRouter } from "expo-router";
import ExpertModal from "@/components/organisms/ExpertModal";
import AddExpertCard from "@/components/molecules/AddTableCard";

export default function TableScreen() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    const fetchTables = async () => {
      if (selectedRestaurant) {
        const data = await getTables(selectedRestaurant.id);
        setTables(data);
      }
    };
    fetchTables();
  }, [selectedRestaurant]);

  const handleCreateTable = async () => {
    const newTable = await createTable({
      name: newTableName,
      restaurantId: selectedRestaurant?.id,
    });
    setTables((prev: any) => [...prev, newTable]);
    setNewTableName("");
    setIsCreateVisible(false);
  };

  const handleUpdateTable = async () => {
    if (!selectedTable) return;
    const updated = await patchTable({
      id: selectedTable.id,
      name: newTableName,
    });
    setTables((prev: any) =>
      prev.map((t: any) => (t.id === updated.id ? updated : t))
    );
    setNewTableName("");
    setSelectedTable(null);
    setIsEditVisible(false);
  };

  const handleDeleteTable = async () => {
    if (!selectedTable) return;
    await deleteTable(selectedTable.id);
    setTables((prev) => prev.filter((t) => t.id !== selectedTable.id));
    setSelectedTable(null);
    setIsEditVisible(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#041224", padding: 24 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#041224",
          paddingVertical: 20,
          paddingHorizontal: 15,
          borderBottomWidth: 1,
          borderBottomColor: "#038082",
        }}
      >
        <Title>Mesas</Title>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingTop: 20,  
          paddingBottom: 40,

        }}
      >
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onPress={() => router.push(`/order?tableId=${table.id}`)}
            onEdit={() => {
              setSelectedTable(table);
              setNewTableName(table.name);
              setIsEditVisible(true);
            }}
          />
        ))}

        <AddExpertCard
          onPress={() => setIsCreateVisible(true)}
          label="Criar Mesa"
        />
      </ScrollView>

      {/* Criar */}
      <ExpertModal
        visible={isCreateVisible}
        title="Nova Mesa"
        inputPlaceholder="Nome da mesa"
        value={newTableName}
        onChangeText={setNewTableName}
        onClose={() => setIsCreateVisible(false)}
        onConfirm={handleCreateTable}
        confirmLabel="Criar Mesa"
      />

      {/* Editar */}
      <ExpertModal
        visible={isEditVisible}
        title="Editar Mesa"
        inputPlaceholder="Nome da mesa"
        value={newTableName}
        onChangeText={setNewTableName}
        onClose={() => setIsEditVisible(false)}
        onConfirm={handleUpdateTable}
        confirmLabel="Atualizar"
        showDelete
        onDelete={handleDeleteTable}
      />
    </View>
  );
}
