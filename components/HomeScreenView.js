
import React from 'react';
import { ScrollView } from 'react-native';
import { TableView } from 'react-native-tableview-simple';
import Card from './Card.js';

// Render cards according to the cards argument received
const HomeScreenView = ({ cards }) => {

  return (
    <ScrollView>
      <TableView>
        {cards.map((card, i) => (
          <Card
            name={card.name}
            cardId={card.cardId}
            imgUri={card.imgUri}
            key={i}
            redirect={'Details'}
            card={card}
          />
        ))}
      </TableView>
    </ScrollView>
  );
};

export default HomeScreenView;