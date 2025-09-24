type Props = {
    checked: boolean,
    setChecked: (checked: boolean) => void;
};

const DisplayToggleButton = ({checked,setChecked}: Props) => {
return (    
<div className="flex w-full justify-start">
<label className="relative inline-block bg-gray-500 w-15 h-7.5 rounded-full">
                <input
                    type="checkbox"
                    id="checkBox"
                    className="sr-only peer"
                    checked={checked}
                    onChange={(e) => {
                        setChecked(e.target.checked);
                    }}
                />
                <span className="bg-blue-400 w-2/5 h-4/5 absolute rounded-full left-1/20 top-1/2 transform -translate-y-1/2 peer-checked:bg-amber-700 peer-checked:left-55/100 transition-all duration-500 ease-in-out"></span>
            </label>
            <p className="pl-2">{checked ? "Switch to Celsius" : "Switch to Fahrenheit"}</p>
            </div>
)};

export default DisplayToggleButton;