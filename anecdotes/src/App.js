import { useState } from "react";

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleClick = () => {
    const randomAnecdote = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomAnecdote);
  };

  const handleVote = () => {
    //new votes array with the old votes and the new vote for the selected anecdotes
    const newVotes = [...votes];
    //increment the vote for the selected anecdote
    newVotes[selected] += 1;
    //set the new votes array
    setVotes(newVotes);
  };
  //find the anecdote with the most votes
  const mostVotes = Math.max(...votes);
  //find the index of the anecdote with the most votes
  const mostVotesIndex = votes.indexOf(mostVotes);
  //find the anecdote with the most votes
  const mostVotedAnecdote = anecdotes[mostVotesIndex];

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={handleVote}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      <h1>Anecdotes with most votes</h1>
      <p>{mostVotedAnecdote} </p>
      <p>has {mostVotes} votes</p>
    </div>
  );
};

export default App;
