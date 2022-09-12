import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

/**
 * COMPONENT
 */
export const Table = ({ game }) => {
  const [cards, setCards] = useState([]);
  const [pot, setPot] = useState(0);
  const [chips, setChips] = useState(0);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [raiseValue, setRaiseValue] = useState(0);
  const [player, setPlayer] = useState(null);
  const [winner, setWinner] = useState(null);
  useEffect(() => {
    setCards(game.cardsOnTable);
    setPot(game.pot);
    setPlayerTurn(game.playerTurn);
    setWinner(game.winner);
  }, [game]);

  const raise = (player) => {
    game.raise(player, raiseValue);
    updateStates();
  };
  const call = (player) => {
    game.call(player);
    updateStates();
  };
  const fold = (player) => {
    game.fold(player);
    updateStates();
  };
  const check = (player) => {
    game.check(player);
    updateStates();
  };

  const updateStates = () => {
    setCards(game.cardsOnTable.slice(0));
    setPlayerTurn(game.playerTurn);
    setPot(game.pot);
    setRaiseValue(0);
    setWinner(game.winner);
  };

  return (
    <div className="pokerGameContainer">
      <div className="playerContainer">
        {game.players.map((player, i) => {
          return (
            <div className="player">
              <div className={`userContainer`} key={i}>
                {playerTurn === i ? <div>Current Player</div> : null}
                <button
                  className="user1"
                  disabled={i !== playerTurn}
                  onClick={() => {
                    call(player);
                  }}
                >
                  Call
                </button>
                <button
                  className="user1"
                  disabled={i !== playerTurn}
                  onClick={() => {
                    raise(player);
                  }}
                >
                  Raise
                </button>
                <input
                  type="number"
                  value={raiseValue}
                  disabled={i !== playerTurn}
                  onChange={(event) => {
                    setRaiseValue(+event.target.value);
                  }}
                />

                <button
                  className="user1"
                  disabled={i !== playerTurn}
                  onClick={() => {
                    check(player);
                  }}
                >
                  Check
                </button>
                <button
                  className="user1"
                  disabled={i !== playerTurn}
                  onClick={() => {
                    fold(player);
                  }}
                >
                  Fold
                </button>
                {player.cards.map((card, i) => {
                  return (
                    <p key={i}>
                      {card.suit}, {card.value}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="gameTable">
        <div className="cards">
          {cards.length
            ? cards.map((card, i) => {
                return (
                  <div key={i}>
                    {card.value}, {card.suit}
                  </div>
                );
              })
            : 'no cards on table'}
        </div>
        <div className="pot">
          <div>Pot: {pot}</div>
        </div>
      </div>
      {winner ? (
        <div>
          WE have a winner with the cards: {winner.cards[0].value} of
          {winner.cards[0].suit} and
          {winner.cards[1].value} of {winner.cards[0].suit}
        </div>
      ) : null}
    </div>
  );
};

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    username: state.auth.username,
  };
};

export default connect(mapState)(Table);
