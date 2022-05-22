import React from 'react';

import logger from '../utils/logger';

class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        logger.error(error, errorInfo);
    }

    render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
