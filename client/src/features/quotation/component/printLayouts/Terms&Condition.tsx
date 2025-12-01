const Terms = ({terms} : {terms: string}) => {
   
    return (
        <div>
            <h3 className="text-lg text-red-600 font-bold">
                Terms and Conditions
            </h3>
            <div className="whitespace-pre-line text-sm text-gray-800">
                {terms}
            </div>
        </div>
    )
}

export default Terms