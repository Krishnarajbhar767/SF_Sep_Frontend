import React from "react";


const InputField = ({
    label,
    name,
    register,
    errors,
    rules = {},
    value,
    type,
    readOnly = false,
}) => {
    return (
        <div className="input-wrapper capitalize">
            <input
                {...register(name, {
                    ...rules,
                    setValueAs: (v) =>
                        typeof v === "string" ? v.trim() : v, // 👈 trims spaces
                })}
                type={type}
                id={name}
                name={name}
                defaultValue={value}
                placeholder=" "
                className="input-field capitalize"
                readOnly={readOnly}
                {...(type === "number" ? { min: 0 } : {})}
                onWheel={(e) => e.target.blur()} // prevent scroll changing number
            />
            <label htmlFor={name} className="input-label capitalize">
                {label}
            </label>
            {errors?.[name] && (
                <p className="text-red-500 text-xs mt-1 absolute capitalize">
                    {errors[name]?.message}
                </p>
            )}
        </div>
    );
};

export default InputField;
