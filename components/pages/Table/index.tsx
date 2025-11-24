import React, { useState, useEffect } from "react";
import TableCard from "@/components/molecules/TableCard";
import ExpertModal from "@/components/organisms/ExpertModal";
import AddExpertCard from "@/components/molecules/AddTableCard";
import Title from "@/components/atoms/Title";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import useRestaurant from "@/hooks/useRestaurant";
import { usePermissions } from "@/hooks/usePermissions";
import {
  createTable,
  getTables,
  patchTable,
  deleteTable,
  Table,
} from "@/services/table";
import * as S from "./styles";

export default function TablePage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [newTableName, setNewTableName] = useState("");
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const { selectedRestaurant } = useRestaurant();
  const { canEdit, canCreate, canDelete } = usePermissions();
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
    if (!canCreate) {
      Toast.show({
        type: "error",
        text1: "Sem permissão",
        text2: "Você não tem permissão para criar mesas",
      });
      return;
    }

    if (!newTableName || !selectedRestaurant) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Preencha o nome da mesa",
      });
      return;
    }
    
    const newTable = await createTable({
      name: newTableName,
      restaurantId: selectedRestaurant?.id,
    });
    setTables((prev: any) => [...prev, newTable]);
    setNewTableName("");
    setIsCreateVisible(false);
  };

  const handleUpdateTable = async () => {
    if (!canEdit) {
      Toast.show({
        type: "error",
        text1: "Sem permissão",
        text2: "Você não tem permissão para editar mesas",
      });
      return;
    }

    if (!selectedTable) return;
    const updated = await patchTable({
      id: selectedTable.id,
      name: newTableName,
      restaurantId: selectedRestaurant?.id || "",
    });
    setTables((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    setNewTableName("");
    setSelectedTable(null);
    setIsEditVisible(false);
  };

  const handleDeleteTable = async () => {
    if (!canDelete) {
      Toast.show({
        type: "error",
        text1: "Sem permissão",
        text2: "Você não tem permissão para excluir mesas",
      });
      return;
    }

    if (!selectedTable) return;
    await deleteTable(selectedTable.id);
    setTables((prev) => prev.filter((t) => t.id !== selectedTable.id));
    setSelectedTable(null);
    setIsEditVisible(false);
  };

  const handleEditPress = (table: Table) => {
    if (!canEdit) {
      Toast.show({
        type: "error",
        text1: "Sem permissão",
        text2: "Você não tem permissão para editar mesas",
      });
      return;
    }
    
    setSelectedTable(table);
    setNewTableName(table.name);
    setIsEditVisible(true);
  };

  return (
    <S.Container>
      <S.Header>
        <Title>Mesas</Title>
      </S.Header>

      <S.TableScroll>
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onPress={() => router.push(`/order?tableId=${table.id}`)}
            onEdit={() => handleEditPress(table)}
            showEditButton={canEdit}
          />
        ))}

        {canCreate && (
          <AddExpertCard
            onPress={() => setIsCreateVisible(true)}
            label="Criar Mesa"
          />
        )}
      </S.TableScroll>

      {canCreate && (
        <ExpertModal
          visible={isCreateVisible}
          title="Nova Mesa"
          inputPlaceholder="Nome da mesa"
          value={newTableName}
          onChangeText={setNewTableName}
          onClose={() => setIsCreateVisible(false)}
          onConfirm={handleCreateTable}
          confirmLabel="Criar Mesa"
          showSwitch={false} 
          switchLabel="" 
          switchValue={false}
        />
      )}

      <ExpertModal
        visible={isEditVisible}
        title="Editar Mesa"
        inputPlaceholder="Nome da mesa"
        value={newTableName}
        onChangeText={setNewTableName}
        onClose={() => setIsEditVisible(false)}
        onConfirm={handleUpdateTable}
        confirmLabel="Atualizar"
        showDelete={canDelete}
        onDelete={handleDeleteTable}
        showSwitch={false}
        switchLabel=""
        switchValue={false}
      />
    </S.Container>
  );
}