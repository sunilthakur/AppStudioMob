import React, { Component, useState } from 'react';
import {
    Text,
    FlatList,
    Image,
    StyleSheet,
    Dimensions,
    View,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import TextInput from '../components/TextInput';
var { height, width } = Dimensions.get('window');
import Swiper from 'react-native-swiper'
import { Platform } from 'react-native';
import apiConfig from '../config/config'
import axios from 'axios';
import { AsyncStorage } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Snackbar, BottomNavigation } from 'react-native-paper';
import deviceStorage from '../services/deviceStorage';
import BackButton from '../components/BackButton';
import Background from '../components/Background';
import Header from '../components/Header';

console.disableYellowBox = true;

export default class SearchMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            MenuList: [],
            selectedItems: [],
            bannerItems: [],
            snackIsVisible: false,
            distance: 0,
            clickedItem: '',
            term: ''
        }
    }
    componentWillMount() {
        AsyncStorage.getItem('cart').then((cart) => {
            if (cart !== null) {
                const cartfood = JSON.parse(cart);
                // console.log("Cart=>", cartfood);
                this.setState({ selectedItems: cartfood })
            }
        })
            .catch((err) => {

            })

    }

    getMenuList() {
        AsyncStorage.getItem('token')
            .then((value) => {
                const item = JSON.parse(value);
                const authorization = `Bearer ${item}`;
                const category = this.state.term;
                console.log("Term=>", category);
                if (category && category.length > 2) {
                    axios
                        .get(apiConfig.baseUrl + 'User/SearchMenuItems?term=' + category + '', {
                            headers: {
                                Accept: 'application/json',
                                Authorization: authorization
                            }
                        })
                        .then(response => {
                            if (response && response.data) {
                                if (response.data.status == 1) {
                                    this.setState({
                                        bannerItems: response.data.object.bannerItems,
                                        MenuList: response.data.object.menuList
                                    });
                                }
                                else {
                                    // Alert.alert(response.data.message);
                                }
                            }
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                else {
                    this.setState({
                        bannerItems: [],
                        MenuList: []
                    });
                }
            });

    }

    _renderItemFood(item) {
        if (item) {
            return (
                <View style={styles.divFoodWithImage} >
                    <Image
                        style={styles.imageFood}
                        resizeMode="contain"
                        source={{ uri: item.itemImage === null ? 'null' : item.itemImage }} />
                    <View style={{ height: ((width / 2) - 20) - 90, backgroundColor: 'transparent', width: ((width / 2) - 20) - 10 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
                        {item.itemName}
                    </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
                        Rs. {parseFloat(item.rate)}
                    </Text>
                    <View style={{ width: 20 }} />
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity onPress={() => this.onClickRemoveCart(item)}>
                            <Icon name="ios-remove-circle" style={{ alignItems: 'flex-start' }} size={35} color={"red"} />
                        </TouchableOpacity>
                        <View style={{ width: 15 }} />
                        <Text style={{ fontSize: 15, color: "green", fontWeight: "bold", paddingTop: 5 }}>{
                            this.state.selectedItems.filter((obj) => obj.id === item.id).length
                        }</Text>
                        <View style={{ width: 15 }} />
                        <TouchableOpacity onPress={() => this.onClickAddCart(item)}>
                            <Icon name="ios-add-circle" style={{ alignItems: 'flex-end', alignContent: 'flex-end' }} size={35} color={"blue"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    onClickAddCart(item) {
        var obj = {
            id: item.id,
            name: item.itemName,
            rate: item.rate
        }
        var cart = this.state.selectedItems;
        cart.push(obj);
        this.setState({ selectedItems: cart, snackIsVisible: true, clickedItem: item.itemName + ' has been added to cart.' })
        deviceStorage.saveItem("cart", cart);
    }

    onClickRemoveCart(item) {
        var filtered = this.state.selectedItems.filter((obj) => obj.id === item.id);
        var index = filtered.findIndex(x => x.id === item.id);
        if (index >= 0) {
            filtered.splice(index, 1);
            this.setState({ selectedItems: filtered, snackIsVisible: true, clickedItem: item.itemName + ' has been removed from cart.' });
        }
        deviceStorage.saveItem("cart", filtered);
    }

    _renderItem(item) {
        if (item) {
            return (
                <View style={styles.divFood} >
                    <View
                        style={{
                            width: (width / 2) + 35,
                            backgroundColor: '#fff',
                            alignItems: 'center',
                            padding: 0
                        }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 13, textAlign: 'left' }}>
                            {item.itemName}
                        </Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', paddingTop: 5 }}>
                            Rs. {parseFloat(item.rate)}
                        </Text>
                    </View>
                    <View
                        style={{
                            width: (width / 2) - 60,
                            // backgroundColor: '#33c37d',
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderRadius: 0,
                            padding: 0,
                            height: 40,
                            right: 0,
                        }}>
                        <View style={{ width: 10 }} />
                        <TouchableOpacity onPress={() => this.onClickRemoveCart(item)}>
                            <Icon name="ios-remove-circle" style={{ alignItems: 'flex-start' }} size={35} color={"red"} />
                        </TouchableOpacity>

                        <View style={{ width: 15 }} />
                        <Text style={{ fontSize: 15, color: "green", fontWeight: "bold" }}>{
                            this.state.selectedItems.filter((obj) => obj.id === item.id).length
                        }</Text>
                        <View style={{ width: 15 }} />
                        <TouchableOpacity onPress={() => this.onClickAddCart(item)}>
                            <Icon name="ios-add-circle" style={{ alignItems: 'flex-end', alignContent: 'flex-end' }} size={35} color={"blue"} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    componentDidMount() {
        this.getMenuList();
    }

    render() {
        return (
            <Background style={{ top: 0, marginTop: 0, padding: 0 }} >
                <View style={((this.bannerItems && this.state.bannerItems.length < 6) && this.state.MenuList.length < 10) ? styles.height0 : styles.height100} />
                <TextInput
                    label="Search Menu"
                    value={this.state.term}
                    onChangeText={text => this.setState({ term: text })}
                    onChange={({ nativeEvent }) => {
                        this.getMenuList();
                    }}
                    style={styles.textInput}
                />
                <View style={{ width: width }}>
                    <ScrollView>
                        <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
                            <View style={{ width: width, borderRadius: 10, paddingVertical: 0, backgroundColor: 'white' }}>
                                <FlatList
                                    data={this.state.bannerItems}
                                    numColumns={2}
                                    renderItem={({ item }) => this._renderItemFood(item)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                {/* {this.state.bannerItems.length > 0 ? <View style={{ height: 20 }} /> : null} */}
                                <FlatList
                                    data={this.state.MenuList}
                                    numColumns={2}
                                    renderItem={({ item }) => this._renderItem(item)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                                <View style={{ height: 100, backgroundColor: '#ffffff00' }} />
                            </View>
                        </View>
                    </ScrollView>
                </View >

            </Background>
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
        marginTop: 0,
        backgroundColor: 'white',
        paddingVertical: 10
    },
    titleCatgAnd: {
        color: 'red',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginTop: 10,
        backgroundColor: 'white',
        paddingVertical: 10
    },
    imageFood: {
        width: ((width / 2) - 20) - 10,
        height: ((width / 2) - 20) - 30,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: -45
    },
    divFood: {
        width: (width - 10),
        borderRadius: 3,
        marginTop: 2,
        marginBottom: 1,
        marginLeft: 5,
        elevation: 8,
        shadowOpacity: 0.1,
        shadowRadius: 50,
        backgroundColor: 'white',
        padding: 10,
        flexDirection: 'row'
    },
    divFoodWithImage: {
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
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        resizeMode: 'contain',
    },
    margin0: {
        marginTop: 0
    },
    margin100: {
        marginTop: (height - 350)
    }, goBack: {
        marginRight: 0,
        top: 0,
        right: 0,
        position: 'absolute'
    },
    height0: {
        height: 0
    },
    height100: {
        height: 100
    },
    textInput: {
        height: 50, marginTop: 30
    }
});