import React from 'react';
import { useParams } from 'react-router-dom';
import ProgressTracker from './ProgressTracker';

const ProgressPage = () => {
  const { courseId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return <ProgressTracker userId={user.id} courseId={courseId} />;
};

export default ProgressPage;