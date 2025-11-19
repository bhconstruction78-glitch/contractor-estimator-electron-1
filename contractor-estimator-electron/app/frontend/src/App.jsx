import React, {useEffect, useState} from 'react';
import axios from 'axios';

export default function App(){
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  const [name, setName] = useState('New Estimate');
  useEffect(()=>{ axios.get('http://localhost:4000/api/items').then(r=>setItems(r.data)).catch(()=>{}); },[]);

  function addLine(item){
    setLines(prev=>[...prev, {
      id: Date.now(), item_id: item?.id || null, description: item?.name || '', qty:1, unit_price: item?.unit_price || 0
    }]);
  }
  function updateLine(i, key, val){ setLines(s=> { const a=[...s]; a[i][key]=val; return a; }); }
  const subtotal = lines.reduce((s,l)=> s + (Number(l.qty)||0)*(Number(l.unit_price)||0), 0);

  async function save(){
    const payload = {name, lines: lines.map(l=>({item_id:l.item_id, description:l.description, qty:l.qty, unit_price:l.unit_price}))};
    await axios.post('http://localhost:4000/api/estimates', payload);
    alert('Estimate saved');
  }

  return (<div style={{padding:20,fontFamily:'Arial'}}>
    <h1>Contractor Estimator (starter)</h1>
    <div><label>Estimate name: <input value={name} onChange={e=>setName(e.target.value)} /></label></div>
    <div style={{marginTop:10}}>
      <button onClick={()=>addLine()}>Add blank line</button>
      {items.slice(0,6).map(it=> <button key={it.id} onClick={()=>addLine(it)} style={{marginLeft:6}}>{it.name}</button>)}
    </div>
    <table style={{width:'100%',marginTop:10,borderCollapse:'collapse'}}>
      <thead><tr><th style={{borderBottom:'1px solid #ddd'}}>Desc</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        {lines.map((l,i)=> (<tr key={l.id}><td><input value={l.description} onChange={e=>updateLine(i,'description',e.target.value)} /></td>
        <td><input type='number' value={l.qty} onChange={e=>updateLine(i,'qty',e.target.value)} style={{width:80}}/></td>
        <td><input type='number' value={l.unit_price} onChange={e=>updateLine(i,'unit_price',e.target.value)} style={{width:100}}/></td>
        <td>{((Number(l.qty)||0)*(Number(l.unit_price)||0)).toFixed(2)}</td></tr>))}
      </tbody>
    </table>
    <div style={{marginTop:10}}>Subtotal: ${subtotal.toFixed(2)}</div>
    <div style={{marginTop:10}}><button onClick={save}>Save Estimate</button></div>
  </div>);
}
