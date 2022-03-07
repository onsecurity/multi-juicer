import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { BodyCard, SecondaryButton, H3 } from '../Components';
import astronaut from './astronaut.svg';

const TeamDisplayCardWrapper = styled(BodyCard)`
  display: flex;
  padding: 16px 32px;
  align-items: center;

  @media (max-width: 1280px) {
    padding: 12px 16px;
  }
`;

const AstronautIcon = styled.img`
  height: 48px;
  width: auto;
  margin-right: 12px;
`;
AstronautIcon.defaultProps = {
  src: astronaut,
};

const TeamDisplayTextWrapper = styled.div`
  flex-grow: 1;
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: var(--font-color-highlight);
  font-weight: 300;
`;

const LogoutButton = () => {
  const navigate = useNavigate();

  function logout() {
    axios.post('/balancer/teams/logout').then(() => navigate('/'));
  }
  return (
    <SecondaryButton onClick={logout}>
      <FormattedMessage id="log_out" defaultMessage="Log Out" />
    </SecondaryButton>
  );
};

const PasscodeResetButton = ({ teamname }) => {
  const navigate = useNavigate();

  async function resetPasscode() {
    const { data } = await axios.post('/balancer/teams/reset-passcode');
    navigate(`/teams/${teamname}/joined/`, { state: { passcode: data.passcode, reset: true }});
  }

  return (
    <SecondaryButton onClick={resetPasscode}>
      <FormattedMessage id="reset_passcode" defaultMessage="Reset Passcode" />
    </SecondaryButton>
  );
};

export const TeamDisplayCard = ({ teamname }) => {
  return (
    <TeamDisplayCardWrapper>
      <AstronautIcon />
      <TeamDisplayTextWrapper>
        <Subtitle>
          <FormattedMessage id="logged_in_as" defaultMessage="Logged in as" />
        </Subtitle>
        <H3>{teamname}</H3>
      </TeamDisplayTextWrapper>
      <LogoutButton />
      <PasscodeResetButton teamname={teamname} />
    </TeamDisplayCardWrapper>
  );
};
