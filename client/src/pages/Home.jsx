import React, {useState, useEffect} from 'react'
import {Loader, Card, FormField} from '../components'
import './home.css'
const RenderCards = ({data, title}) => {
  if(data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post}/>)
  }
  return (
    <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>
  )

}
const Home = () => {
  const [loading, setloading] = useState(false);
  const [AllPosts, setAllPosts] = useState(null);
  const [searchtext, setSearchtext] = useState("");
  const [searchedResults, setsearchedResults] = useState(null);
  const [searchTimeout, setsearchTimeout] = useState(null);

  const fetchPosts = async () => {
    setloading(true);
    try {
      const response = await fetch('https://genai-smay.onrender.com/api/v1/post', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if(response.ok){
        const result = await response.json();
        setAllPosts(result.data.reverse());
      }
    } catch (error) {
      alert(error)
    }finally{
      setloading(false)
    }
  }
  
  const handleSearchChange = (e) =>{
    clearTimeout(searchTimeout);
    setSearchtext(e.target.value);

    setsearchTimeout(
      setTimeout(()=>{
        const searchResults = AllPosts.filter((item) =>
        item.name.toLowerCase().includes(searchtext.toLowerCase()) || 
        item.prompt.toLowerCase().includes(searchtext.toLowerCase())
        );
        setsearchedResults(searchResults);
      }, 500))
    }
    
    
  useEffect(()=>{
    fetchPosts();
  },[])


  return (
      <section className='max-w-7xl mx-auto'>
        <div>
          <h1 className='font-extrabold text-[#222328] text-[32px]'> Spotlight</h1>
          <p className='mt-2 text-[#666e75] text-[16px] max-w-[500px]'>Explore a compilation of creative and visually striking images produced by the DALL-E AI.</p>
        </div>
        <div className='mt-16 '>
          <FormField
            labelName="Search Posts"
            type="text"
            name="text"
            placeholder="Search posts"
            value={searchtext}
            handleChange={handleSearchChange}
          />
        </div>
        <div className='mt-10'>
          {loading ? (
            <div className='flex justify-center items-center'><Loader /></div>
          ) : (
            <>
              {searchtext && (
                <h2 className='font-medium text-[#666e75] text-xl mb-3'>Showing results for 
                  <span className='text-[#222328]'> {searchtext}</span>
                </h2>
              )}
              <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3 '>
                {searchtext ?(
                  <RenderCards
                    data={searchedResults}
                    title="No search results could be found"
                  />
                ) : (
                  <RenderCards
                  data={AllPosts}
                  title="No posts could be found"
                />
                )}
              </div>
            </>
          )}
        </div>
      </section>
  )
}

export default Home