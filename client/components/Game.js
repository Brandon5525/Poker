import React, { useState } from 'react';
import Table from './Table';

export const Game = () => {
  const [game, setGame] = useState(null);
  const suits = ['diamond', 'clubs', 'hearts', 'spade'];
  const value = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  class Card {
    constructor(suit, value) {
      this.suit = suit;
      this.value = value;
    }
  }

  class Deck {
    constructor(shouldShuffle = true) {
      this.cards = this.createDeck();
      if (shouldShuffle) this.shuffle();
    }

    createDeck() {
      return suits.flatMap((suit) => {
        return value.map((value) => {
          return new Card(suit, value);
        });
      });
    }

    shuffle() {
      for (let i = 0; i < this.cards.length; i++) {
        const newIndex = Math.floor(Math.random() * (i + 1));
        const oldValue = this.cards[newIndex];
        this.cards[newIndex] = this.cards[i];
        this.cards[i] = oldValue;
      }
    }

    draw() {
      return this.cards.pop();
    }
  }

  class Player {
    constructor(totalChips) {
      this.betAmount = 0;
      //bet amount resets at every round
      this.totalChips = totalChips;
      this.cards = [];
      this.status = true;
      this.chipsAtStartOfRound = this.totalChips;
      //true represents they are still in the game
      //array that holds the two cards they have
    }
    //methods for betting
    call(bet) {
      this.betAmount = bet;
      this.totalChips = this.totalChips - bet;
    }
    raise(bet) {
      this.betAmount = bet;
      this.totalChips = this.totalChips - bet;
    }
    fold() {
      this.status = false;
    }
  }

  class PokerGame {
    constructor(players) {
      this.deck = new Deck();
      //also needs to shuffle the deck
      this.players = players;
      //array of players
      //check player amount is 2 or greater but less than 8
      this.currentPhase = 'preflop';
      //phase of the game. do phase[this.phase]
      this.smallBlindPosition = 0;
      this.smallBlindValue = 10;
      this.bigBlindValue = 20;
      this.pot = 0;
      this.currentBet = 0;
      this.cardsOnTable = [];
      this.checkCounter = 0;
      this.playerTurn = this.smallBlindPosition;
      this.potAtStartOfRound = this.pot;
      this.winner = null;

      //create and shuffle deck this.deck
      //check if there's at minimum 2 players. this.players could be an array
      //check to to make sure bet amount of players is equivalent after call or raises while(player.betAmount !== ) once loop is broken go to next round
      //keep track of the "rounds": preFlop, flop, river, turn
      //Once preflop finishes flip one card
      //blinds small-10 big -20
      //pot to hold all the chips
    }

    get bigBlindPosition() {
      if (this.smallBlindPosition === this.players.length - 1) {
        return 0;
      }

      return this.smallBlindPosition + 1;
    }

    incrementSmallBlind() {
      if (this.smallBlindPosition === this.players.length - 1) {
        this.smallBlindPosition = 0;
      } else {
        this.smallBlindPosition++;
      }
    }

    deal() {
      //for loop 2 times
      //pop off deck and push into players array
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].cards.push(this.deck.cards.pop());
      }
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].cards.push(this.deck.cards.pop());
      }
    }

    getPot() {
      let pot = 0;
      for (let i = 0; i < this.players.length; i++) {
        pot += this.players[i].betAmount;
      }
      return pot;
    }

    call(player) {
      if (player.betAmount) {
        // this.pot -= player.betAmount;
        player.betAmount = this.currentBet;
        player.totalChips = player.chipsAtStartOfRound - player.betAmount;
        this.currentBet = player.betAmount;
        // this.pot = this.getPot();
      } else {
        player.betAmount = this.currentBet;
        player.totalChips = player.chipsAtStartOfRound - player.betAmount;
      }
      this.pot = this.getPot() + this.potAtStartOfRound;
      this.checkCounter += 1;
      console.log('the button was clicked');
      this.nextPlayer();
      this.checkIfRoundEnds();
    }

    raise(player, bet) {
      console.log('the button was clicked');
      this.checkCounter = 0;

      this.call(player);
      player.betAmount += bet;
      player.totalChips = player.chipsAtStartOfRound - player.betAmount;
      this.pot = this.getPot() + this.potAtStartOfRound;
      this.currentBet += bet;
    }

    fold(player) {
      console.log('the button was clicked');
      player.status = false;
      player.betAmount = 0;
      this.checkCounter += 1;
      this.checkIfRoundEnds();
      this.nextPlayer();
    }

    check(player) {
      this.checkCounter++;
      console.log('the button was clicked');
      this.nextPlayer();
    }

    nextPlayer() {
      if (this.playerTurn === this.players.length - 1) {
        this.playerTurn = 0;
      } else {
        this.playerTurn++;
      }
    }

    checkIfRoundEnds() {
      if (this.checkCounter >= this.players.length) {
        this.nextPhase();
      }
    }

    nextPhase() {
      switch (this.currentPhase) {
        case 'preflop':
          this.currentPhase = 'flop';
          this.checkCounter = 0;
          this.playerTurn = this.smallBlindPosition;
          this.flop();
          break;
        case 'flop':
          this.currentPhase = 'river';

          this.checkCounter = 0;
          this.playerTurn = this.smallBlindPosition;
          this.river();
          break;
        case 'river':
          this.currentPhase = 'turn';
          this.checkCounter = 0;
          this.playerTurn = this.smallBlindPosition;
          this.turn();
          break;
        case 'turn':
          this.findWinner();

          break;
      }
    }

    findWinner() {
      let winner = this.players[0];
      let highCard = this.players[0].cards[0];
      for (let i = 0; i < this.players.length; i++) {
        const player = this.players[i];
        for (let j = 0; j < player.cards.length; j++) {
          const card = player.cards[j];
          if (card.value > highCard.value) {
            highCard = card;
            winner = player;
          }
        }
      }
      this.winner = winner;
      winner.totalChips += this.pot;
    }

    resetChipsAtStart() {
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].chipsAtStartOfRound = this.players[i].totalChips;
        this.players[i].betAmount = 0;
        this.potAtStartOfRound = this.pot;
      }
    }

    blinds() {
      this.players[this.smallBlindPosition].betAmount = this.smallBlindValue;
      this.players[this.smallBlindPosition].totalChips -= this.smallBlindValue;
      this.pot += this.players[this.smallBlindPosition].betAmount;
      this.players[this.bigBlindPosition].betAmount = this.bigBlindValue;
      this.players[this.bigBlindPosition].totalChips -= this.bigBlindValue;
      this.currentBet = this.bigBlindValue;
      this.pot += this.players[this.bigBlindPosition].betAmount;
    }

    preflop() {
      this.deal();
      this.blinds();
      this.nextPlayer();
      this.nextPlayer();
      console.log('this.currentPhase :>> ', this.currentPhase);
    }

    flop() {
      //burn a card flip 3
      //let them bet
      //once everyone calls same amount finish
      console.log('this.currentPhase :>> ', this.currentPhase);
      this.resetChipsAtStart();
      this.deck.draw();
      this.cardsOnTable.push(this.deck.draw());
      this.cardsOnTable.push(this.deck.draw());
      this.cardsOnTable.push(this.deck.draw());
    }

    river() {
      console.log('this.currentPhase :>> ', this.currentPhase);
      this.resetChipsAtStart();
      this.deck.draw();
      this.cardsOnTable.push(this.deck.draw());
    }

    turn() {
      console.log('this.currentPhase :>> ', this.currentPhase);
      this.resetChipsAtStart();
      this.deck.draw();
      this.cardsOnTable.push(this.deck.draw());
    }
  }

  const startGame = () => {
    const player1 = new Player(1000);
    const player2 = new Player(1000);
    const player3 = new Player(1000);

    const newPokerGame = new PokerGame([player1, player2, player3]);
    setGame(newPokerGame);

    newPokerGame.preflop();
  };

  return (
    <div>
      {game ? (
        <Table game={game} />
      ) : (
        <button
          onClick={() => {
            startGame();
          }}
        >
          Start
        </button>
      )}
    </div>
  );
};
