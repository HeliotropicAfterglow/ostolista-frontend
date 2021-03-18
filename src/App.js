import './App.css';
import { useState,useEffect } from 'react';

const URL = 'http://localhost/ostolista/'

function App() {
  const [items, setItems] = useState([]);
  const [description, setDescription] = useState('');
  const [amount,setAmount] = useState(0);

    useEffect(() => {
      fetch(URL + 'index.php')
      .then(response => response.json())
      .then(
        (response) => {
          setItems(response);
        }, (error) => {
          alert(error);
        }
      )
    }, [])

    function addItem(e) {
      e.preventDefault();
      let status = 0;
      fetch(URL + 'add.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type':'application/json',
        },
        body: JSON.stringify({
          description: description,
          amount: amount
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            setItems(items => [...items, res]);
            setDescription('');
            setAmount(0);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error);
        }
      )
    }

    function deleteItem(id) {
      let status = 0;
      fetch(URL + 'delete.php', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-type':'application/json',
        },
        body: JSON.stringify({
          id: id
        })
      })
      .then(res => {
        status = parseInt(res.status);
        return res.json();
      })
      .then(
        (res) => {
          if (status === 200) {
            const newListWithoutRemoved = items.filter((item) => item.id !== id);
            setItems(newListWithoutRemoved);
          } else {
            alert(res.error);
          }
        }, (error) => {
          alert(error)
        }
      )
    }
  
  return (
    <>
      <h3>Shopping list</h3>
      <form onSubmit={addItem}>
        <label>New item:
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder='enter description'/>
          <input value={amount} onChange={e => setAmount(e.target.value)} placeholder='enter amount'/>
          <button>Add</button>
        </label>
      </form>
      
      <ol>
        {items.map(item => (
          <li type='none' key={item.id}><label style={{paddingRight: 50}}>{item.description}</label><label style={{paddingRight: 100}}>{item.amount}</label><a onClick={() => deleteItem(item.id)} href="#">Delete</a></li>
        ))}
      </ol>
    </>
  );
}

export default App;
