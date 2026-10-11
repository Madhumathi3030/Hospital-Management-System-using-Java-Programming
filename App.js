import React, { useEffect, useState } from "react";

const API = `${process.env.REACT_APP_BACKEND_URL || "http://localhost:8001"}/api`;

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await fetch(`${API}/items`);
      setItems(await res.json());
      setError("");
    } catch {
      setError("Cannot reach backend. Is it running on port 8001?");
    }
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await fetch(`${API}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    setText("");
    load();
  };

  const remove = async (id) => {
    await fetch(`${API}/items/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <main className="container">
      <h1>My Fullstack App</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={add}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add an item..." />
        <button type="submit">Add</button>
      </form>
      <ul>
        {items.map((i) => (
          <li key={i.id}>
            <span>{i.text}</span>
            <button className="del" onClick={() => remove(i.id)}>✕</button>
          </li>
        ))}
      </ul>
    </main>
  );
}
