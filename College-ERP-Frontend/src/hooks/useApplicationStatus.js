import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const STEP_KEYS = [
    'admission',
    'personalDetails',
    'parentDetails',
    'addressDetails',
    'academicDetails',
    'documents',
    'review',
];

const useApplicationStatus = () => {
    const [stepStatus, setStepStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatus = useCallback(async () => {
        try {
            setError(null);
            const res = await api.get('/application/status');
            if (res.data.success) {
                setStepStatus(res.data.data);
            }
        } catch (err) {
            // If 404, student hasn't created admission yet
            if (err.response?.status === 404) {
                setStepStatus({
                    steps: {
                        admission: false,
                        personalDetails: false,
                        parentDetails: false,
                        addressDetails: false,
                        academicDetails: false,
                        documents: false,
                        review: false,
                    },
                    completedCount: 0,
                    totalSteps: 7,
                    progressPercent: 0,
                    activeStepIndex: 1,
                    applicationStatus: null,
                    studentId: null,
                });
            } else {
                setError(err.response?.data?.message || 'Failed to fetch status');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Helper: get status for a step index (1-based)
    const getStepState = useCallback((stepIndex) => {
        if (!stepStatus) return 'NOT_STARTED';

        const key = STEP_KEYS[stepIndex - 1];
        if (!key) return 'NOT_STARTED';

        const isCompleted = stepStatus.steps[key];
        const isActive = stepStatus.activeStepIndex === stepIndex;

        if (isCompleted) return 'COMPLETED';
        if (isActive) return 'IN_PROGRESS';
        return 'NOT_STARTED';
    }, [stepStatus]);

    // Helper: check if a step is clickable
    const isStepAccessible = useCallback((stepIndex) => {
        if (!stepStatus) return stepIndex === 1;

        const state = getStepState(stepIndex);
        return state === 'COMPLETED' || state === 'IN_PROGRESS';
    }, [stepStatus, getStepState]);

    return {
        stepStatus,
        loading,
        error,
        refetch: fetchStatus,
        getStepState,
        isStepAccessible,
        STEP_KEYS,
    };
};

export default useApplicationStatus;
