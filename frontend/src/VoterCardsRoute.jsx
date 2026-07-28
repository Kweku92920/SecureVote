import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VoterCardsPanel from '../components/VoterCardsPanel';
import { api } from '../lib/api';

const VoterCardsRoute = () => {
  const navigate = useNavigate();
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    api.get('/voters')
      .then(setVoters)
      .catch((error) => toast.error(error.message));
  }, []);

  return <VoterCardsPanel votersDataset={voters} onBackToVoters={() => navigate('/admin/voters')} />;
};

export default VoterCardsRoute;
