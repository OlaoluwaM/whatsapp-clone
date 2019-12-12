import React from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane } from 'react-icons/fa';
import { Button } from './UI-components';
import styled from 'styled-components';
import { AuthContext } from '../context/Context';

const HomePage = styled.div`
  position: relative;
  width: 100%;
  height: 94%;
  background: var(--main);
  div {
    z-index: 10;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 60%;
    height: 33%;

    h1 {
      text-align: center;
      font-size: 3.7rem;
      font-family: var(--font1);
      color: var(--sub);
      font-weight: 100;
      margin-bottom: 0;
    }
  }
`;

const iconStyles = {
  fill: 'var(--main)',
  marginRight: '15px',
};

export default function Home() {
  const isAuthed = React.useContext(AuthContext);
  return (
    <HomePage>
      <div>
        <h1>Welcome to Chatter</h1>
        <Link to={isAuthed ? '/Chat' : '/Auth'}>
          <Button style={{ background: 'var(--sub)', color: 'var(--main)' }}>
            <FaPaperPlane style={iconStyles} />
            Chat
          </Button>
        </Link>
      </div>
    </HomePage>
  );
}
