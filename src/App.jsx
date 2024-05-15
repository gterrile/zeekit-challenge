import { useEffect, useState } from 'react'
import './App.css'

function removeCharacters(movie) {
  let indexesToBeRemoved = []
  for (let i = 0; i < movie.length / 4; i++) {
    indexesToBeRemoved[i] = generateIndex(movie, indexesToBeRemoved)
  }
  let partialName = ''
  for (let i = 0; i < movie.length; i++) {
    indexesToBeRemoved.includes(i) ? partialName = partialName.concat('_') : partialName = partialName.concat(movie[i])
  }
  return partialName
}

function generateIndex(movie, listOfIndexes) {
  let randomIndex = Math.floor(Math.random() * movie.length)
  if (!listOfIndexes.includes(randomIndex) && movie[randomIndex] !== ' ') {
    return randomIndex
  } else {
    return generateIndex(movie, listOfIndexes)
  } 
}

async function fetchRandomMovie() {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`
      }
    };
    try {
      const response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
      const result = await response.json()
      const randomIndexomIndex = Math.floor(Math.random() * result.results.length)
      return result.results[randomIndexomIndex].title
    } catch(err) {
      return err
    }
}

function App() {

  const [movie, setMovie] = useState('')
  const [partialMovie, setPartialMovie] = useState('')
  const [loading, setLoading] = useState(true)
  const [attemp, setAttemp] = useState('')
  const [display, setDisplay] = useState(false)
  const [message, setMessage] = useState('')
  const [points, setPoints] = useState(0)

  function playAgain() {
    setDisplay(false)
    setLoading(false)
    setMovie('')
    setPartialMovie('')
    setAttemp('')
    fetchAndSetRandomMovie()
  }

  function handleSumbit() {
    if (attemp.toLocaleLowerCase() === movie.toLocaleLowerCase()) {
      setPoints(points + 1) 
      setMessage('Correct!') 
    } else {
      setPoints(points - 1)
      setMessage('Incorrect')
    }
    
    setDisplay(true)

  } 

  function fetchAndSetRandomMovie() {
    let randomMovie = fetchRandomMovie()
    randomMovie.then(movie => {
      setMovie(movie)
      setPartialMovie(removeCharacters(movie))
      setLoading(false)
    })
    .catch(err => console.log(err))
  }

  useEffect(() => {

    fetchAndSetRandomMovie()

    return (
      setLoading(true),
      setAttemp('')
    )
     
  },[])

  return (
    <>
      <h1 className="font-bold">Zeekit Challenge</h1>
      <h2 className='text-lg font-bold mt-2'>
        Guess the name of the movie by completing the missing letters.
      </h2>
      {
        loading ? (<h1>Loading...</h1>)  
        : display ? (<div className='h-40 w-full bg-blue-300'>
            <h1>{message}</h1>
            <h2>points: {points}</h2>
            <button onClick={playAgain}>Play Again</button>
            </div>) 
            : (
              <section className='p-40'>
                <div className='text-3xl font-bold font-mono mt-2'>{partialMovie}</div>

                <input name='attemp' value={attemp} 
                  onChange={(e) => setAttemp(e.target.value)} 
                  type="text"
                  autoComplete='off' 
                  className='text-3xl font-bold font-mono mt-2 focus:outline-none text-orange-300' 
                  size={movie.length}
                  maxLength={movie.length}/>
                <br />
                <button onClick={handleSumbit} className='font-mono mt-6 text-xl font-bold text-orange-300'>Submit</button>
              </section>  
        )
      }
    </>
  )
}

export default App
