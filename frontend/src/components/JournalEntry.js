import React, { useState } from 'react';

const JournalEntry = ({ onSubmit }) => {
  const [entry, setEntry] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    setIsLoading(true);
    await onSubmit(entry);
    setEntry('');
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
        placeholder="Write your journal entry..."
        rows={4}
        cols={50}
        disabled={isLoading}
      />
      <br />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Thinking...' : 'Submit'}
      </button>
    </form>
  );
};

export default JournalEntry;
