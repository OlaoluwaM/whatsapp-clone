import React from 'react';
import Form from './Form';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { hexToRgb } from '../utils/helper';
import { spring, spring2 } from '../utils/motionObj';

const AuthPage = styled.div.attrs({
  className: 'wrapper',
})`
  position: relative;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.main};
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const SwitchText = styled(motion.p)`
  color: ${({ theme }) => hexToRgb(theme.sub, 0.3)};
  text-transform: capitalize;
  font-family: var(--font1);
  font-size: 1.1rem;
  cursor: pointer;
  font-weight: bolder;
  position: fixed;
  bottom: 12px;
  margin-bottom: 5px;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => hexToRgb(theme.sub, 1)};
  }
`;

export default function Auth({ location, setAuth }) {
  const initialValue = location.state ? location.state.formType : 'login';
  const [state, setState] = React.useState(initialValue);

  React.useEffect(() => {
    if (location.state) setState(location.state.formType);
  }, [location]);

  return (
    <AuthPage>
      <Form setAuth={setAuth} formType={state} />
      <SwitchText
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: -10 }}
        transition={{ ...spring, delay: 1.3 }}
        layoutTransition={{ type: 'tween' }}
        onClick={() => setState(s => (s === 'login' ? 'sign-up' : 'login'))}>
        {state === 'login' ? ' Create an account' : ' Log into your account'}
      </SwitchText>
    </AuthPage>
  );
}
