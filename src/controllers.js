

export const handleAskAI = async (req, res) => {
    try {

        res.status(200).json({
            success: true,
            answer: 'hello'
        });

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};