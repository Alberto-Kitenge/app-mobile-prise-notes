import { NOTE_CATEGORIES, NOTE_COLORS } from "@/constants/notesConstants";
import { useNotesStore } from "@/stores/notesStore";
import {
  CreateNote,
  ModalNoteProps,
  NoteCategory,
  NoteColor,
  UpdateNote,
} from "@/types/notesTypes";
import { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ModalNotes({
  visible,
  mode,
  note,
  onClose,
  onSuccess,
  onEdit,
}: ModalNoteProps) {
  const { addNote, updateNote, deleteNote } = useNotesStore();
  const [data, setData] = useState<CreateNote>({
    title: "",
    description: "",
    category: NOTE_CATEGORIES[0],
    color: NOTE_COLORS[0],
  });

  const [loading, setLoading] = useState(false);

  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";
  const isCreateMode = mode === "create";

  const resetForm = () => {
    setData({
      title: "",
      description: "",
      category: NOTE_CATEGORIES[0],
      color: NOTE_COLORS[0],
    });
  };

  useEffect(() => {
    if (note) {
      setData({
        title: note.title,
        description: note.description,
        category: note.category,
        color: note.color || NOTE_COLORS[0],
      });
    } else if (isCreateMode) {
      resetForm();
    }
  }, [note, visible, mode]);

  const updateField = (
    field: keyof CreateNote,
    value: string | NoteCategory | NoteColor,
  ) => {
    if (isViewMode) return;

    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (isViewMode) return;

    if (!data.title.trim() || !data.description.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);

    try {
      if (isEditMode && note) {
        const updateData: Partial<UpdateNote> = {
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category,
          color: data.color,
        };
        await updateNote(note.id, updateData);
        Alert.alert("Succès", "Note mise à jour avec succès");
      } else if (isCreateMode) {
        const newNote: CreateNote = {
          title: data.title.trim(),
          description: data.description.trim(),
          category: data.category,
          color: data.color,
        };
        await addNote(newNote);
        Alert.alert("Succès", "Note créée avec succès");
      }

      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Erreur lors du submit du formulaire", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!note) return;

    Alert.alert("Suppression", "Voulez-vous vraiment supprimer cette note ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: async () => {
          await deleteNote(note.id);
          Alert.alert("Succès", "Note supprimée avec succès");
          onClose();
        },
      },
    ]);
  };

  const getTitle = () => {
    switch (mode) {
      case "create":
        return "Nouvelle note";
      case "edit":
        return "Modification de la note";
      case "view":
        return "Détails";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "create":
        return "Créez une nouvelle note";
      case "edit":
        return "Modifiez la note";
      case "view":
        return "Détails de la note";
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Date inconnue";

    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={[styles.indicator, { backgroundColor: data.color }]}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <Text style={styles.title}>{getTitle()}</Text>
                <Text style={styles.subtitle}>{getSubtitle()}</Text>
              </View>

              <View style={styles.headerActions}>
                {isViewMode && note && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDelete}
                  >
                    <Text style={styles.deleteText}>🗑️</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Text style={styles.closeText}>❌</Text>
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {isViewMode && note ? (
                <View style={styles.viewContent}>
                  <Text style={styles.viewTitle}>{note.title}</Text>
                  <View style={styles.descriptionBox}>
                    <Text style={styles.descriptionText}>
                      {note.description}
                    </Text>
                  </View>

                  <View style={styles.metaData}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Catégories</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{note.category}</Text>
                      </View>
                    </View>

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Créé le</Text>
                      <Text style={styles.metaValue}>
                        {formatDate(note.createdAt)}
                      </Text>
                    </View>

                    {note.updatedAt && note.updatedAt !== note.createdAt && (
                      <View style={styles.metaItem}>
                        <Text style={styles.metaLabel}>Modifié le</Text>
                        <Text style={styles.metaValue}>
                          {formatDate(note.updatedAt)}
                        </Text>
                      </View>
                    )}

                    <View style={styles.metaItem}>
                      <Text style={styles.metaLabel}>Couleur</Text>
                      <View style={styles.colorInfo}>
                        <View
                          style={[
                            styles.colorPreview,
                            { backgroundColor: note.color || "#667eea" },
                          ]}
                        />
                        <Text style={styles.colorValue}>
                          {note.color || "#667eea"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ) : (
                <>
                  <View style={styles.group}>
                    <Text style={styles.label}>Titre *</Text>
                    <TextInput
                      style={styles.input}
                      value={data.title}
                      onChangeText={(value) => updateField("title", value)}
                      placeholder="Entrez le titre de la note"
                      placeholderTextColor="#9ca3af"
                      maxLength={50}
                      editable={!isViewMode}
                    />
                  </View>

                  <View style={styles.group}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      value={data.description}
                      onChangeText={(value) =>
                        updateField("description", value)
                      }
                      placeholder="Entrez la description de la note"
                      placeholderTextColor="#9ca3af"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      maxLength={500}
                      editable={!isViewMode}
                    />
                  </View>

                  <View style={styles.group}>
                    <Text style={styles.label}>Catégorie</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.catContainer}
                    >
                      {NOTE_CATEGORIES.map((cat) => (
                        <TouchableOpacity
                          key={cat}
                          style={[
                            styles.catOption,
                            data.category === cat && styles.catSelected,
                          ]}
                          onPress={() => updateField("category", cat)}
                          disabled={isViewMode}
                        >
                          <Text
                            style={[
                              styles.catText,
                              data.category === cat && styles.catTextSelected,
                            ]}
                          >
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <View style={styles.group}>
                    <Text style={styles.label}>Couleur</Text>
                    <View style={styles.colorContainer}>
                      {NOTE_COLORS.map((col) => (
                        <TouchableOpacity
                          key={col}
                          style={[
                            styles.colorOption,
                            data.color === col && styles.colorSelected,
                          ]}
                          onPress={() => updateField("color", col)}
                          disabled={isViewMode}
                        >
                          {data.color === col && (
                            <View style={styles.checkmark}>
                              <Text style={styles.checkmarkText}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            {!isViewMode && (
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={onClose}
                >
                  <Text style={styles.buttonTextSecondary}>Annuler</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.buttonPrimary,
                    loading && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  <Text style={styles.buttonTextPrimary}>
                    {loading
                      ? "Enregistrement..."
                      : isEditMode
                        ? "Modifier"
                        : "Créer"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {isViewMode && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.buttonPrimary} onPress={onEdit}>
                  <Text style={styles.buttonTextPrimary}>Modifier</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonSecondary}
                  onPress={onClose}
                >
                  <Text style={styles.buttonTextSecondary}>Fermer</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "100%",
    maxWidth: 350,
    minHeight: 500,
    maxHeight: 700,
    overflow: "hidden",
  },
  indicator: {
    height: 4,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  deleteText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  closeText: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  viewContent: {
    gap: 20,
  },
  viewTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: 32,
  },
  descriptionBox: {
    backgroundColor: "#f9fafb",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  descriptionText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    textAlign: "justify",
  },
  metaData: {
    gap: 12,
  },
  metaItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  badgeText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  colorInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  colorValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  group: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#1f2937",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  catContainer: {
    flexDirection: "row",
  },
  catOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 8,
  },
  catSelected: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  catText: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  catTextSelected: {
    color: "#fff",
  },
  colorContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  checkmark: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "bold",
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelected: {
    borderColor: "#1f2937",
    borderWidth: 3,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  buttonSecondary: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6b7280",
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: "#667eea",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
