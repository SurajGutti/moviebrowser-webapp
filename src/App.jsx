import "./App.css";

const Card = ({ title }) => {
  return (
    <>
      <div className="card">
        <h2>{title}</h2>
      </div>
    </>
  );
};

const App = () => {
  return (
    <>
      <div className="card-container">
        <Card title="Star Wars" />
        <Card title="Stuart Little" />
        <Card title="Bambi" />
      </div>
    </>
  );
};

export default App;
