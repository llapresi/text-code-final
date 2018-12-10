import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import './App.css';
import Typography from '@material-ui/core/Typography';
import StepList from './StepList';

const caesarSalad = require('caesar-salad');
const CryptoJS = require("crypto-js");

let cipherOptions = [
  'ROT13-Cipher',
  'ROT13-Decipher',
  'Vigenere-Cipher',
  'Vigenere-Decipher',
  'AES-Encrypt',
  'AES-Decrypt',
  'Base64-Encode',
  'Base64-Decode',
  'RC4-Encrypt',
  'RC4-Decrypt',
  'MD5-Hash (One Way)'
];

let hasParamsMap = {
  'ROT13-Cipher': false,
  'ROT13-Decipher': false,
  'Vigenere-Cipher': true,
  'Vigenere-Decipher': true,
  'AES-Encrypt': true,
  'AES-Decrypt': true,
  'Base64-Encode': false,
  'Base64-Decode': false,
  'RC4-Encrypt': true,
  'RC4-Decrypt': true,
  'MD5-Hash (One Way)': false,
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      addStepMenu: false,
      inputText: '',
      steps: [
      ],
    }
  }

  handleInput = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClick = name => event => {
    this.setState({ [name]: event.currentTarget });
  };

  handleSwitch = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleClose = (event, index) => {
    if (index !== 'backdropClick' && index !== 'escapeKeyDown') {
      let newStep = [
        cipherOptions[index],
        'insert key here',
      ];
      console.log(index);
      this.setState({ addStepMenu: null, steps: [...this.state.steps, newStep] });
    } else {
      this.setState({ addStepMenu: null });
    }
  };

  setStepKey = index => event =>  {
    const { steps } = this.state;
    let newArray = steps.slice();
    newArray[index][1] = event.target.value;
    this.setState({ steps: newArray });
  }

  calculateFinalOutput = input => {
    const { steps } = this.state;
    let toReturn = input;

    // Wrapped in try-catch so we don't crash the browser
    try {
      for(let i = 0; i < steps.length; i++) {
        switch (steps[i][0]) {
          // Encodes
          case 'ROT13-Cipher':
            toReturn = caesarSalad.ROT13.Cipher().crypt(toReturn);
            break;
          case 'Vigenere-Cipher':
            toReturn = caesarSalad.Vigenere.Cipher(steps[i][1].toString()).crypt(toReturn);
            break;
          case 'AES-Encrypt':
            toReturn = CryptoJS.AES.encrypt(toReturn, steps[i][1]).toString();
            break;
          case 'Base64-Encode':
            toReturn = btoa(toReturn);
            break;
          case 'RC4-Encrypt':
            toReturn = CryptoJS.RC4.encrypt(toReturn, steps[i][1]).toString();
            break;
          case 'MD5-Hash (One Way)':
            toReturn = CryptoJS.MD5(toReturn).toString();
            break;
            
          // Decodes
          case 'ROT13-Decipher':
            toReturn = caesarSalad.ROT13.Decipher().crypt(toReturn);
            break;
          case 'Vigenere-Decipher':
            toReturn = caesarSalad.Vigenere.Decipher(steps[i][1].toString()).crypt(toReturn);
            break;
          case 'AES-Decrypt':
            toReturn = CryptoJS.AES.decrypt(toReturn, steps[i][1]).toString(CryptoJS.enc.Utf8)
            break;
          case 'Base64-Decode':
            toReturn = atob(toReturn);
            break;
          case 'RC4-Decrypt':
            toReturn = CryptoJS.RC4.decrypt(toReturn, steps[i][1]).toString(CryptoJS.enc.Utf8);
            break;
          default:
            break;
        }
      }
    }
    catch (err) {
      console.log(err);
      toReturn = err.message;
    }

    // Return new input text
    return toReturn;
  }

  removeStep = (index) => {
    const { steps } = this.state;
    let newArray = steps.slice();
    newArray.splice(index, 1);
    this.setState({ steps: newArray });
  }

  render() {
    const { addStepMenu, inputText, steps } = this.state;

    return (
      <div className="App">
        <Typography variant="h2">
          En/decoder Pipeline
        </Typography>
        <Typography variant="h6">
          Luke Lapresi | Text and Code Final Project | 10 December 2018
        </Typography>

        <TextField
          id="outlined-multiline-flexible"
          label="Input Text"
          multiline
          rows="4"
          margin="normal"
          variant="outlined"
          value={inputText}
          onChange={this.handleInput('inputText')}
        />
        <Button variant="contained" color="primary" onClick={this.handleClick('addStepMenu')}>
          + Add Encoding/Decoding
        </Button>
        
        <Menu
          id="simple-menu"
          anchorEl={addStepMenu}
          open={Boolean(addStepMenu)}
          onClose={this.handleClose}
        >
          {cipherOptions.map((option, index) => (
            <MenuItem
              key={option}
              onClick={event => this.handleClose(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>

        <Typography variant="h6" style={{ marginTop: '2rem', marginBottom: '.4rem' }}>
          Current Coding Steps:
        </Typography>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: '500px',
        }}
        >
          {steps.length ? 
            <StepList
              steps={steps}
              removeStep={this.removeStep}
              setStepKey={this.setStepKey}
              hasParamsMap={hasParamsMap}
            />
            : (
              <Typography variant='body1'>
                No encodings or decodings are current active. Use the "Add Encoding/Decoding" to
                add encoding and decoding processes.
              </Typography>
            )
          }
        </div>

        <Typography variant="h6" style={{marginTop: '1rem'}}>
          Output:
        </Typography>

        <Typography variant="body1" style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '24px'}}>
          {this.calculateFinalOutput(inputText)}
        </Typography>
      </div>
    );
  }
}

export default App;
