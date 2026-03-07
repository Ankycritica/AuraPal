import React, { useState } from 'react';
import { PremiumUpsellModal } from './PremiumUpsellModal';
import { Button } from './ui/button';

export default {
    title: 'Components/PremiumUpsellModal',
    component: PremiumUpsellModal,
};

export const Interactive = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="p-8">
            <Button onClick={() => setOpen(true)}>Open Premium Upsell</Button>
            <PremiumUpsellModal open={open} onOpenChange={setOpen} />
        </div>
    );
};
