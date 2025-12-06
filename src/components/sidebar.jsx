const Sidebar = () => (
  <div 
    style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '10px', 
      padding: '20px', 
      alignItems: 'center',
      backgroundColor: '#3d654bff', // ljusgrön bakgrund
      minHeight: '100vh', // fyll hela höjden
      width: '250px' // fast bredd,
    }}>
    <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Hydrologi</button>
    <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Ekologi</button>
    <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>Fältstudie</button>
    <button style={{ width: '150px', padding: '15px', textAlign: 'center', backgroundColor: '#597D68' }}>4</button>
  </div>
);

export default Sidebar;
