import React, { Component } from 'react';
import {
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native';
var { height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper'
import { Platform } from 'react-native';
import apiConfig from '../config/config'
import axios from 'axios';
import { AsyncStorage } from 'react-native';
console.disableYellowBox = true;

export default class Cuisines extends Component {
    constructor(props) {
        console.log("Propd", props);
        super(props);
        this.state = {
            dataBanner: [],
            dataCategories: [],
            selectedCategory: 0,
            module: 2
        }
    }

    getCategoriesList() {
        AsyncStorage.getItem('token')
            .then((value) => {
                const item = JSON.parse(value);
                const authorization = `Bearer ${item}`;
                axios
                    .get(apiConfig.baseUrl + 'User/GetCategoriesList', {
                        headers: {
                            Accept: 'application/json',
                            Authorization: authorization
                        }
                    })
                    .then(response => {
                        if (response && response.data) {
                            if (response.data.status == 1) {
                                this.setState({ dataCategories: response.data.list });
                            }
                            else {
                                Alert.alert(response.data.message);
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            });
    }

    navigateToMenu(cateroryId) {
        console.log("Cuisine Props=>", this.props);
        this.setState({ selectedCategory: cateroryId });
        this.props.values.navigation.navigate('MenuScreen', { selectedCategoryId: cateroryId });
    }

    _renderItemFood(item) {
        if (item) {
            return (
                <TouchableOpacity style={styles.divFood} onPress={() => this.navigateToMenu(item.id)}>
                    <Image
                        style={styles.imageFood}
                        resizeMode="contain"
                        source={{ uri: item.groupImage }} />
                    <View style={{ height: ((width / 2) - 20) - 90, backgroundColor: 'transparent', width: ((width / 2) - 20) - 10 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
                        {item.groupName}
                    </Text>
                </TouchableOpacity>
            )
        }
        else {
            <Text>No Categrories Found..</Text>
        }
    }

    componentDidMount() {
        const url = "http://tutofox.com/foodapp/api.json"
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataBanner: responseJson.banner
                });
                this.getCategoriesList();
            })
            .catch((error) => {
                this.getCategoriesList();
                console.error(error);
            });
    }

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
                    <View style={{ width: width, alignItems: 'center' }} >
                        <Image style={(Platform.OS === 'ios') ? styles.imageLogoIos : styles.imageLogo} resizeMode="contain" source={require("../assets/foodapp.png")} />
                        <Swiper style={{ height: width / 2 }} showsButtons={false} autoplay={true} autoplayTimeout={2}>
                            {
                                this.state.dataBanner.map((itembann) => {
                                    return (
                                        <Image key={itembann} style={styles.imageBanner} resizeMode="contain" source={{ uri: itembann }} />
                                    )
                                })
                            }
                        </Swiper>
                        <View style={{ height: 20 }} />
                    </View>

                    <View style={{ width: width, borderRadius: 10, paddingVertical: 20, backgroundColor: 'white' }}>
                        <Text style={styles.titleCatg}>Categories {this.state.selectedCategory}</Text>
                        {/* <Text>{JSON.stringify(this.state.dataCategories)}</Text> */}
                        <View style={{ height: 20 }} />
                        <FlatList
                            data={this.state.dataCategories}
                            numColumns={2}
                            renderItem={({ item }) => this._renderItemFood(item)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                        <View style={{ height: 20 }} />
                    </View>
                </View>
            </ScrollView>

        );
    }

}

const styles = StyleSheet.create({
    imageBanner: {
        height: width / 2,
        width: width - 40,
        borderRadius: 10,
        marginHorizontal: 20
    },
    imageLogoIos: {
        height: 60,
        width: width / 2,
        margin: 10
    },
    imageLogo: {
        height: 60,
        width: width / 2,
        margin: 10,
        marginTop: 25
    },
    titleCatg: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 0
    },
    imageFood: {
        width: ((width / 2) - 20) - 10,
        height: ((width / 2) - 20) - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: -45
    },
    divFood: {
        width: (width / 2) - 20,
        padding: 10,
        borderRadius: 10,
        marginTop: 55,
        marginBottom: 5,
        marginLeft: 10,
        alignItems: 'center',
        elevation: 8,
        shadowOpacity: 0.3,
        shadowRadius: 50,
        backgroundColor: 'white',
    }
});