import { useState, useEffect, useCallback } from "react"

function Numpad(props) {
  function generateNum() {
    let numElems = []
    let btnId = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
    for(let i = btnId.length-1; i>=0; i--) {
      numElems.push(
        <button id={btnId[i]} onClick={props.inputFunction} key={btnId[i]}>{i}</button>
      )
    }
    
    numElems.push(<button id="decimal" key="decimal">.</button>)
    return numElems
  }
  return(
    generateNum()
  )
}

function Display(props) {
  let display = props.displayText
  if (display === '') {
    display = "0"
  }
  return(
    <div id="display">
      {display}
    </div>
  )
}

function Formula(props) {
  let formula = props.formulaText
  if (formula === '') {
    formula = "0"
  }
  return(
    <div className="formula">
      {formula}
    </div>

  )
}

function App() {
  const [formula, setFormula] = useState("")
  const [display, setDisplay] = useState("")
  const [decimalMode, setDecimalMode] = useState(false)
  const [onResult, setOnResult] = useState(false)
  
  function getResult() {
    let result = formula.replace(/x/g, "*")
    result = eval(result)

    setDisplay(result)
    setOnResult(true)
  }
  
  const handleInput = useCallback(e => {
    const operand = ["+", "-", "x", "/"]
    let btnVal = e.target.innerText.toString()
    // last character in formula
    let lastChar = formula.slice(-1);
    

    // if input is an operand
    if (operand.includes(btnVal) && lastChar !== ".") {
      if (onResult) {
        setFormula(display)
        setOnResult(false)
      }
      // if last char is an operand and not minus sign
      if (btnVal === "-" && lastChar !== "-"){
        setFormula(prevFormula => prevFormula + btnVal)
        setDisplay(btnVal)
        
        // if last char isn't operand and not empty
      } else if (lastChar !== "" && !operand.includes(lastChar)){
        setFormula(prevFormula => prevFormula + btnVal)
        setDisplay(btnVal)
      
        // lastchar is operand and not empty
      } else if (lastChar !== "" ) {
        console.log()
        setFormula(prevFormula => prevFormula.slice(0,-2) + prevFormula.slice(-2, prevFormula.length).replace(/[\D]/g, "") + btnVal)
        setDisplay(btnVal)
      }
      
      if (decimalMode) {
        setDecimalMode(false)
      }
      
    // if input isnt operand and not decimal
    } else if (btnVal !== ".") {
      if (onResult) {
        clear()
        setOnResult(false)
      }

      if (operand.includes(display)) {
        setDisplay("")
      }

      // disallow input zero at the beginning of number
      if ((!operand.includes(lastChar) && lastChar !== "") || btnVal !== "0") {
        setFormula(prevFormula => prevFormula + btnVal)
        setDisplay(prevDisplay => prevDisplay + btnVal)  
      }
      
    // if input is decimal
    } else {
      if (onResult) {
        clear()
        setOnResult(false)
      }

      if (!operand.includes(lastChar) && !decimalMode) {
        if (lastChar === "") {
          setDisplay("0.")
          setFormula("0.")
        } else {
          setFormula(prevFormula => prevFormula + btnVal)
          setDisplay(prevDisplay => prevDisplay + btnVal)  
        }
        setDecimalMode(true)
      }
    }
  }, [formula, display, decimalMode, onResult])
  
  const clear = () => {
    setDisplay("")
    setFormula("")
    setDecimalMode(false)
  }

  useEffect(() => {
    let elems = document.querySelectorAll("#clear, #multiply, #divide, #add, #subtract, #decimal")
    elems.forEach(elem => {
      elem.addEventListener("click", handleInput)
    })
    
    
    return () => {
      elems.forEach(elem => {
        elem.removeEventListener("click", handleInput)
      })
    }
  }, [handleInput])


  
  return (
    <div className="calculator">
      <Formula formulaText={formula} />
      <Display displayText={display} />
      
        <div className="operand">
          <button id="clear" onClick={clear}>CE</button>
          <button id="multiply">x</button>
          <button id="divide">/</button>
          <button id="add" >+</button>
          <button id="subtract">-</button>
        </div>
        <div className="num">
          <Numpad inputFunction={handleInput} />
          <button id="equals" onClick={getResult}>=</button>
        </div>
      </div>
  )  
}

export default App;