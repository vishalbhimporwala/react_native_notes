import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {use, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {deleteNoteApi, notelist} from '../services/notes';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../Navigation/types';
import {useNavigation} from '@react-navigation/native';
import {Note} from '../models/note';
import {User} from '../models/user';
import {AxiosError} from 'axios';

const NoteListScreen = () => {
  // type NoteScreenNavigationProp = NativeStackNavigationProp<
  //   RootStackParamList,
  //   'Login'
  // >;

  type NoteScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

  const navigation = useNavigation<NoteScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [loader, setLoader] = useState(true);
  const [noteList, setNoteList] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleAddNote = async () => {
    if (user) {
      navigation.navigate('NoteAdd', {
        onNoteAdded: (newNote: Note) => {
          setNoteList(prevList => [newNote, ...prevList]);
        },
      });
    }
  };

  const handleLogout = async () => {
    AsyncStorage.clear();
    navigation.reset({index: 0, routes: [{name: 'Login'}]});
  };

  const handleUpdateNote = async (note: Note) => {
    if (user) {
      navigation.navigate('NoteAdd', {
        note,
        onUpdateNote: (updatedNote: Note) => {
          setNoteList(prevList =>
            prevList.map(item =>
              item._id === updatedNote._id ? updatedNote : item,
            ),
          );
        },
      });
    }
  };

  const handleDelete = async (note: Note) => {
    setLoader(true);
    try {
      console.log('delete note id : ', note._id);
      const response = await deleteNoteApi(note._id);
      setNoteList(prevList => prevList.filter(item => item._id !== note._id));
      console.log('delete api : ', JSON.stringify(response));
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('delete api error : ', JSON.stringify(axiosError));
    } finally {
      setLoader(false);
    }
  };

  const fetchUserAndList = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser: User = JSON.parse(userData);
        console.log('notes list : api called');
        const response = await notelist();
        console.log('notes list : ', JSON.stringify(response.data));
        setNoteList(response.data);
        setUser(parsedUser);
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true); // Show the loading spinner
    await fetchUserAndList(); // Fetch the updated list of notes
    setRefreshing(false); // Hide the loading spinner after refreshing
  };

  useEffect(() => {
    fetchUserAndList();
  }, []);

  const noteItem = (note: Note) => (
    <TouchableOpacity onPress={() => handleUpdateNote(note)}>
      <View style={styles.noteItem}>
        <View style={{flex: 1, paddingRight: 8}}>
          <Text style={{color: 'rgb(255, 255, 255)'}}>{note.title}</Text>
          <Text numberOfLines={2} style={{color: 'rgb(255, 255, 255)'}}>
            {note.description}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteIconContainer}
          onPress={() => handleDelete(note)}>
          <Image
            style={styles.deleteIcon}
            source={require('../../assets/icons/delete_icon.png')}></Image>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  return (
    <LinearGradient
      style={{flex: 1}}
      colors={['rgb(85, 0, 255)', 'rgb(44, 14, 105)']}>
      <View style={styles.topbar}>
        <Text style={{fontSize: 20, color: 'rgb(255, 255, 255)'}}>
          Welcome , {user?.firstName ?? 'Unknown'}
        </Text>
        <Button title="Logout" onPress={handleLogout}></Button>
      </View>

      <FlatList
        data={noteList}
        keyExtractor={item => item._id}
        renderItem={({item}) => noteItem(item)}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          !loader ? (
            <View style={styles.noDataContainer}>
              <Text
                style={{
                  fontSize: 30,
                  color: 'rgb(255, 255, 255)',
                }}>
                No data
              </Text>
            </View>
          ) : null
        }
      />

      <TouchableOpacity onPress={handleAddNote}>
        <Image
          style={styles.icon}
          source={require('../../assets/icons/add_icon.png')}></Image>
      </TouchableOpacity>

      {loader ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="rgb(255, 0, 0)" size="large" />
        </View>
      ) : null}
    </LinearGradient>
  );
};

export default NoteListScreen;

const styles = StyleSheet.create({
  topbar: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noteItem: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderColor: 'rgb(255, 255, 255)',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  icon: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 20,
    tintColor: 'rgb(255, 255, 255)',
    bottom: 30,
  },
  deleteIconContainer: {
    alignSelf: 'center',
    padding: 10,
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: 'rgb(255, 255, 255)',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  loaderContainer: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
