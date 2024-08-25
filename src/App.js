import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import Axios from 'axios';
import Select from 'react-select';

function App() {
  const [jsonData, setJsonData] = useState('');
  const [isValidJson, setIsValidJson] = useState(true);
  const [parsedData, setParsedData] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [alphabets,setAlpha]=useState([]);
  const [numbers,setNum]=useState([]);
  const [highestLowercase,setHLA]=useState([]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setJsonData(input);

    try {
      const parsed = JSON.parse(input);
      setParsedData(parsed);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
      setParsedData(null);
    }
  };
  const handleSubmit = () => {
    if (isValidJson) {
      console.log('Valid JSON:', parsedData);
      Axios.post("http://localhost:4000/bhfl",parsedData)
      .then((res)=>{
        console.log(res.data);
        setNum(res.data.numbers);
        setAlpha(res.data.alphabets);
        setHLA(res.data.highest_lowercase_alphabet);
        console.log(res.data.is_success);
      })
      .catch((err)=>console.log(err))
      setShowDropdown(true);
    } else {
      console.log('Invalid JSON');
      setShowDropdown(false);
    }
  };
  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase', label: 'Highest lowercase alphabet' }
  ];
  const handleSelectChange = (selected) => {
    setSelectedOptions(selected);
  };

  return (
    <div style={{marginTop:"100px"}} className="App m-5">
      <textarea
        value={jsonData}
        onChange={handleInputChange}
        placeholder="Enter JSON data here"
        rows="10"
        cols="50"
      />
      <br />
      {!isValidJson && <p style={{ color: 'red' }}>Invalid JSON format</p>}
      <button onClick={handleSubmit} disabled={!isValidJson}>
        Submit
      </button>
      {showDropdown && (
        <div style={{ marginTop: '20px' }}>
          <Select
            isMulti
            options={options}
            onChange={handleSelectChange}
            placeholder="Select options..."
          />
        </div>
      )}

      {selectedOptions.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          {selectedOptions.some(option => option.value === 'alphabets') && (
            <div>
              <h3>Alphabets:</h3>
              <pre>{JSON.stringify(alphabets, null)}</pre>
            </div>
          )}
          {selectedOptions.some(option => option.value === 'numbers') && (
            <div>
              <h3>Numbers:</h3>
              <pre>{JSON.stringify(numbers, null)}</pre>
            </div>
          )}
          {selectedOptions.some(option => option.value === 'highest_lowercase') && (
            <div>
              <h3>Highest Lowercase Alphabet:</h3>
              <pre>{JSON.stringify(highestLowercase, null)}</pre>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default App;
