import { useState } from 'react';
import { Header } from '@/components/Header';
import { Movies } from '@/pages/Movies';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={setSearchQuery} searchQuery={searchQuery} />
      <Movies searchQuery={searchQuery} />
    </div>
  );
};

export default Index;
