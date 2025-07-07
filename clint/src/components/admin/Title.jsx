import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        <h1>
            {text1}
            <span className='underline text-primary'>
                {text2}
            </span>
        </h1>
    )
}

export default Title