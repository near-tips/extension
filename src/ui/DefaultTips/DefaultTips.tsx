import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

const DEFAULT_TIPS_STORAGE_KEY = 'default-tips-storage-key';

const DefaultTips = () => {
    const [defaultTips, setDefaultTips] = useState(0.3);

    useEffect(() => {
        chrome.storage.sync.get([DEFAULT_TIPS_STORAGE_KEY], function(result) {
            console.log('Value currently is ' + result.key, result.value);

            setDefaultTips(result.value);
        });
    }, []);

    const handleChange = useCallback((evt) => {
        setDefaultTips(evt.target.value);
    }, []);

    const handleSave = useCallback(() => {
        chrome.storage.sync.set({[DEFAULT_TIPS_STORAGE_KEY]: defaultTips}, function() {
            console.log('Value is set to ' + defaultTips);
        });
    }, [defaultTips]);

    return (
        <div>
            <input
                type="number"
                onChange={handleChange}
            />
            <button
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    )
};

export default DefaultTips;
