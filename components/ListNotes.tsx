import { useNotes, useNotesStore } from "@/stores/notesStore";
import { ListNotesProps, Note } from "@/types/notesTypes";
import { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ListNotesItem from "./ListNotesItem";

export default function ListNotes({
  onViewNote,
}: Omit<ListNotesProps, "onEditNote">) {
  const { getNotes } = useNotesStore();
  const notes = useNotes();

  useEffect(() => {
    getNotes();
  }, []);

  const renderNote = ({ item }: { item: Note; index: number }) => (
    <ListNotesItem note={item} onView={onViewNote} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id!}
        renderItem={renderNote}
        contentContainerStyle={[
          styles.listContainer,
          notes.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 12,
  },
});
