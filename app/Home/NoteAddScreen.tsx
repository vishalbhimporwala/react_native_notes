import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../Navigation/types';
import InputField from '../Components/InputField';
import {addNoteApi, updateNoteApi} from '../services/notes';
import {AxiosError} from 'axios';

type ScreenRouteProp = RouteProp<RootStackParamList>;

const NoteAddScreen = () => {
  const [loading, setLoading] = useState(false);
  const route = useRoute<ScreenRouteProp>();
  const onNoteAdded = route.params?.onNoteAdded;
  const onUpdateNote = route.params?.onUpdateNote;
  const descRef = useRef<TextInput>(null);

  const existNote = route.params?.note;
  const [title, setTitle] = useState(existNote ? existNote.title : '');
  const [description, setDescription] = useState(
    existNote ? existNote.description : '',
  );
  const [error, setError] = useState({titleError: '', descError: ''});
  const navigation = useNavigation();

  const validate = () => {
    let isValid = true;
    const newErrors = {titleError: '', descError: ''};

    if (!title.trim()) {
      newErrors.titleError = 'Enter valid title';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.descError = 'Enter valid desciption';
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleAddNote = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      let response;
      if (existNote) {
        const payload = {
          noteId: existNote._id,
          title: title,
          description: description,
        };
        response = await updateNoteApi(payload);
        if (onUpdateNote) {
          onUpdateNote(response.data);
        }
      } else {
        const payload = {
          title: title,
          description: description,
        };
        response = await addNoteApi(payload);
        if (onNoteAdded) {
          onNoteAdded(response.data);
        }
      }
      navigation.goBack();
      console.log('Add or update note api response ', JSON.stringify(response));
    } catch (error) {
      const axiosError = error as AxiosError;
      Alert.alert('Notes', 'Notes add fail');
      setError({titleError: '', descError: axiosError.message});
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      style={{flex: 1, paddingHorizontal: 20}}
      colors={['rgb(85, 0, 255)', 'rgb(44, 14, 105)']}>
      <View style={styles.topbar}>
        <Text style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}>
          {existNote ? 'Update Note' : 'Add Note '}
        </Text>
      </View>

      <InputField
        placeHolder="Enter title"
        onChangeText={setTitle}
        text={title}
        inputType="default"
        onSubmitEditing={() => descRef.current?.focus()}
        keyboardSubmit="next"
      />

      {error.titleError ? (
        <Text style={{color: 'rgb(255, 0, 0)'}}>{error.titleError}</Text>
      ) : null}

      <InputField
        inputRef={descRef}
        placeHolder="Enter Description"
        onChangeText={setDescription}
        text={description}
        inputType="default"
        keyboardSubmit="done"
      />
      {error.descError ? (
        <Text style={{color: 'rgb(255, 0, 0)'}}>{error.descError}</Text>
      ) : null}

      <TouchableOpacity
        disabled={loading}
        style={styles.addButton}
        onPress={() => handleAddNote()}>
        {loading ? (
          <ActivityIndicator size="small" color="rgb(255, 0, 0)" />
        ) : (
          <Text style={styles.addButtonText}>
            {loading
              ? existNote
                ? 'Updating Note'
                : 'Adding Note'
              : existNote
              ? 'Update Note'
              : 'Add Note'}
          </Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default NoteAddScreen;

const styles = StyleSheet.create({
  topbar: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'rgb(0, 64, 255)',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: 'rgb(255, 255, 255)',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
});
