
import React from 'react';
import { ScrollView } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from './Card.js';


const HomeScreen = () => {
    let cards = [
      {
        "name": "The Ice Cream Shop",
        "cardNum": "12321323",
        "imgUri": require("../assets/icecreamRestaurant.jpeg"),
        items: [
          {
            "title": "Gelato",
            "contents": [
              { "title": "Vanilla", "imgUri": require("../assets/icecream.jpeg") },
              { "title": "Chocolate" }]
          },
          {
            "title": "Cake",
            "contents": [{ "title": "Chocolate" }]
          }]
      },
      {
        "name": "Ichiban Ramen",
        "cardNum": "12321323",
        "imgUri": require("../assets/japaneseRestaurant.jpeg"),
        items: [
          {
            "title": "Mains",
            "contents": [{ "title": "Teriyaki Donburi" }]
          }]
      },
      {
        "name": "Cafe La France",
        "cardNum": "12321323213",
        "imgUri": require("../assets/franceRestaurant.jpeg"),
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
          {cards.map((card, i) => (
            <Card
              name={card.name}
              cardNum={card.cardNum}
              imgUri={card.imgUri}
              key={i}
              action={'Details'}
              card={card}
            />
          ))}
        </TableView>
      </ScrollView>
    );
  };

  export default HomeScreen;