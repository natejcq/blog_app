import Editor from '../Editor';
import { useState, useEffect } from "react";
import {Navigate} from "react-router-dom";

export default function CreatePost(){
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState(''); 
    const [files, setFiles] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        //Fetch the categories 
        async function fetchCategories(){
            try{
                const response = await fetch('http://localhost:4000/categories');
                if(response.ok){
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        }

        //Call the category function
        fetchCategories(); 
    }, [])

    async function createNewPost(ev){
        const data = new  FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        data.set('category', selectedCategory); 
        ev.preventDefault();  
        console.log(files);  
        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            //Will be easier to send all the data not as a JSON but as a form data 
            body: data,
            credentials: 'include',
        });
        if (response.ok){
            setRedirect(true);
        }
    }

    if(redirect){
        return <Navigate to={'/'} />
    }
    return(
        <form onSubmit={createNewPost}>
            <input type="title" 
                placeholder={"Title"}
                value={title}    
                onChange={ev => setTitle(ev.target.value)}
            />
            <input type="summary" 
                placeholder={"Summary"} 
                value={summary} 
                onChange={ev => setSummary(ev.target.value)}    
            />   
            <input type="file"

                onChange={ev => setFiles(ev.target.files)}    
            />
            
            
            <select 
                value={selectedCategory} 
                onChange= {ev => setSelectedCategory(ev.target.value)}
            >
                <option value="">Select Cateogry</option>
                {categories.map((cat) => (
                    <option key = {cat._id} value={cat.name}>
                        {cat.name}
                    </option>
                ))}
            </select>


             <Editor onChange={setContent} value={content}/>
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    )
}