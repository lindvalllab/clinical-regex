import { useContext } from 'react';
import styled from 'styled-components';
import { ApiContext } from '../../api';
import TextDisplay from '../../components/TextDisplay';
import './ViewTexts.css';

const Button = styled.button`
  background: transparent;
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  margin: 0.5em 1em;
  padding: 0.25em 1em;
`;

function ViewTexts(): JSX.Element {
  const api = useContext(ApiContext);
  const onClick = async () => {
    console.log('Button clicked');
    const result = await api.getAllTexts();
    console.log(result);
  };

  return (
    <div className="ViewTexts page">
      <Button onClick={onClick}>Log all Text objects to console</Button>
      <TextDisplay />
    </div>
  );
}

export default ViewTexts;
