import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import logger from '../../utils/logger';
import { DEFAULT_TIPS_STORAGE_KEY, DEFAULT_TIPS } from '../../utils/constants';

const DefaultTips = () => {
    const [defaultTips, setDefaultTips] = useState(DEFAULT_TIPS);

    useEffect(() => {
        chrome.storage.local.get([DEFAULT_TIPS_STORAGE_KEY], function(result) {
            logger.log('Value currently is ' + result.key, result.value, result);

            const savedDefaultTipsAmount = Number(result[DEFAULT_TIPS_STORAGE_KEY]);

            if (savedDefaultTipsAmount) {
                setDefaultTips(savedDefaultTipsAmount);
            }
        });
    }, []);

    const handleChange = useCallback((evt) => {
        setDefaultTips(evt.target.value);
    }, []);

    const handleSave = useCallback(() => {
        chrome.storage.local.set({[DEFAULT_TIPS_STORAGE_KEY]: defaultTips}, function() {
            logger.log('Value is set to ' + defaultTips);
        });
    }, [defaultTips]);

    return (
        <div>
            <input
                className="input"
                type="number"
                onChange={handleChange}
                value={defaultTips}
            />
            <button
                className="button"
                onClick={handleSave}
            >
                Save
            </button>
        </div>
    )
};

export default DefaultTips;
