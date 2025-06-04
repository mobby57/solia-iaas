function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-4xl font-bold text-primary mb-4">Bienvenue sur Solia</h1>
      <p className="text-lg text-gray-600 mb-6">
        Plateforme solidaire pour collectes et campagnes associatives.
      </p>
      <button className="px-6 py-3 bg-accent text-white rounded-xl shadow hover:bg-green-600 transition">
        Créer un compte
      </button>
    </div>
  );
}

export default App;
