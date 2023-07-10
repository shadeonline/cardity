import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';

const Stack = createStackNavigator();

const RestaurantsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Restaurants!</Text>
      <StatusBar style="auto" />
    </View>
  )
};
const MenuScreenCell = ({ content, key }) => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  const decrementCounter = () => {
    if (counter > 0) {
      setCounter(counter - 1);
    }
  };

  return (
    <Cell
      key={key}
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 290, width: '100%', backgroundColor: 'transparent', highlightColor: "#ccc" }}
      cellContentView={
        <View>
          <Text>{content.title}</Text>
          {content.imgUri ? (
            <Image source={content.imgUri} style={[styles.image, { height: '70%', aspectRatio: 15 / 9 }]} />
          ) : (
            <Image source={require('./assets/placeholder.jpg')} style={[styles.image, { height: '70%', aspectRatio: 15 / 9 }]} />
          )}
          <View style={styles.counterContainer}>
            <TouchableOpacity onPress={decrementCounter} style={styles.counterButton}>
              <Text style={styles.counterButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.counterText}>{counter}</Text>
            <TouchableOpacity onPress={incrementCounter} style={styles.counterButton}>
              <Text style={styles.counterButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      }
    />
  );
};

const MenuScreen = ({ route }) => {
  const { menu } = route.params;

  return (
    <ScrollView>
      <TableView>
        {menu.map((item, index) => (
          <Section key={index} header={item.title}>
            {item.contents.map((content, index) => (
              <MenuScreenCell content={content} key={index} />
            ))}
          </Section>
        ))}
      </TableView>
      <StatusBar style="auto" />
    </ScrollView>
  );
};

const HomeScreenCell = ({ name, tagline, eta, imgUri, action, menu }) => {
  const navigation = useNavigation();

  return (
    <Cell
      onPress={() => action(navigation, menu)}
      contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', height: 290, width: '100%', backgroundColor: 'transparent', highlightColor: "#ccc" }}
      cellContentView={
        <View>
          <Image source={imgUri} style={[styles.image, { height: '70%', aspectRatio: 15 / 9 }]} />
          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>{eta}</Text>
            <Text style={styles.etaText}>mins</Text>
          </View>
          <Text style={styles.titleText}>{name}</Text>
          <Text style={styles.taglineText}>{tagline}</Text>
        </View>
      }
    />
  );
};

const navigateToMenu = (navigation, menu) => {
  navigation.navigate('Menu', { menu }); // Navigate to the "Menu" screen
};

const HomeScreen = () => {
  let restaurantsTable = [
    {
      "name": "The Ice Cream Shop",
      "tagline": "Desert, Ice cream, £££",
      "eta": "10-30",
      "imgUri": require("./assets/icecreamRestaurant.jpeg"),
      items: [
        {
          "title": "Gelato",
          "contents": [
            { "title": "Vanilla", "imgUri": require("./assets/icecream.jpeg") },
            { "title": "Chocolate" }]
        },
        {
          "title": "Cake",
          "contents": [{ "title": "Chocolate" }]
        }]
    },
    {
      "name": "Ichiban Ramen",
      "tagline": "Japanese Food, £££",
      "eta": "19-30",
      "imgUri": require("./assets/japaneseRestaurant.jpeg"),
      items: [
        {
          "title": "Mains",
          "contents": [{ "title": "Teriyaki Donburi" }]
        }]
    },
    {
      "name": "Cafe La France",
      "tagline": "French Food, £££",
      "eta": "10 -20",
      "imgUri": require("./assets/franceRestaurant.jpeg"),
      items: [
        {
          "title": "Mains",
          "contents": [
            { "title": "Coq au Vin" }]
        }]
    },
  ]

  return (
    <ScrollView>
      <TableView>
        {restaurantsTable.map((restaurant, i) => (
          <HomeScreenCell
            name={restaurant.name}
            tagline={restaurant.tagline}
            eta={restaurant.eta}
            imgUri={restaurant.imgUri}
            key={i}
            action={navigateToMenu}
            menu={restaurant.items}
          />
        ))}
      </TableView>
    </ScrollView>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantsScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
  cellContentView: {
    backgroundColor: 'transparent'
  },
  image: {
    width: '100%',
    borderRadius: 5,
    alignSelf: 'center',
  },
  etaContainer: {
    position: 'absolute',
    top: '62%',
    right: '7%',
    backgroundColor: 'black',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 90,
    alignItems: 'center',
  },
  etaText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  titleText: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  taglineText: {
    color: 'black',
    fontSize: 12,
    marginBottom: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  counterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
};
