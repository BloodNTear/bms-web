import "./SearchBar.css";

import { useState } from "react";

import { IoSearch } from "react-icons/io5";

function SearchBar({ placeholderText, onChange, onSubmit }) {

    const [searchValue, setSearchValue] = useState("");

    function handleChange(value){

        setSearchValue(value);

        onChange && onChange(value);
    }

    function handleSubmit(){
        onSubmit && onSubmit(searchValue);
    }

    return (
        <div className="searchbar">
            <div className="searchbar-input">
                <input 
                    type="text" 
                    placeholder={placeholderText}
                    value={searchValue}
                    onChange={(e) => handleChange(e.target.value)} 
                />
                <div className="search-button">
                    <IoSearch 
                        onClick={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}

export default SearchBar;