import { AsyncStorage } from 'react-native';
const deviceStorage = {
  async saveItem(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log('AsyncStorage Error: ' + error.message);
    }
  },
  async getToken() {
    try {
      await AsyncStorage.getItem('token')
        .then((value) => {
          const item = JSON.parse(value);
          const authorization = `Bearer ${item}`;
          return authorization;
        });
    } catch (error) {
      console.log("MyHeader not found");
    }
  }
};

export default deviceStorage;