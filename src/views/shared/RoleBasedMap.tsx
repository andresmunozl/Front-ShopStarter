import React, { useEffect, useRef, useState } from 'react';
import { Card, Badge, Spinner, Button, Modal, Label, TextInput } from 'flowbite-react';
import { Icon } from '@iconify/react';
import api from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { useMap } from '../../context/MapContext';
import { toast } from 'react-hot-toast';
import VendorCatalogModal from '../../components/geo/VendorCatalogModal';
import { useTranslation } from "react-i18next";

const RoleBasedMap: React.FC = () => {
    const { t } = useTranslation("tradRoleMAPi");
    const { user } = useAuth();
    const { userLocation, requestLocation, gettingLocation } = useMap();
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<any>(null);
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState<any[]>([]);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPosition, setSelectedPosition] = useState<{lat: number, lng: number} | null>(null);
    const [locationDescription, setLocationDescription] = useState('');

    const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<{id: string, name: string} | null>(null);

    useEffect(() => {
        (window as any).openVendorCatalog = (vendorId: string, vendorName: string) => {
             setSelectedVendor({ id: vendorId, name: vendorName });
             setIsCatalogModalOpen(true);
        };

        const checkLeaflet = setInterval(() => {
            if ((window as any).L) {
                clearInterval(checkLeaflet);
                initMap();
            }
        }, 100);

        return () => {
            if (leafletMap.current) {
                leafletMap.current.remove();
            }
            clearInterval(checkLeaflet);
            delete (window as any).openVendorCatalog;
        };
    }, [user?.role]);

    const initMap = async () => {
        const L = (window as any).L;
        if (!L || !mapRef.current) return;

        if (leafletMap.current) {
            leafletMap.current.remove();
        }

        leafletMap.current = L.map(mapRef.current).setView([2.4419, -76.6062], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(leafletMap.current);

        if (user?.role === 'VENDEDOR') {
            leafletMap.current.on('click', (e: any) => {
                setSelectedPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
                setIsEditModalOpen(true);
            });
        }

        fetchAndRenderMarkers(L);
    };

    const fetchAndRenderMarkers = async (L: any) => {
        try {
            setLoading(true);

            let endpoint = 'geo/vendors-locations/';
            if (user?.role === 'VENDEDOR') endpoint = 'geo/my-locations/';

            const response = await api.get(endpoint);
            const data = response.data;
            setLocations(data);

            const markers: any[] = [];
            data.forEach((loc: any) => {
                const marker = L.marker([loc.latitude, loc.longitude])
                    .addTo(leafletMap.current)
                    .bindPopup(`
                        <div class="p-2">
                            <b class="text-primary">${loc.user_name || t("map.popup.establishment")}</b><br/>
                            <p class="text-xs text-gray-500 mb-2">${loc.description || t("map.popup.noDescription")}</p>
                            ${user?.role === 'ADMIN' ? `<p class="text-[10px] text-red-400">${t("map.popup.owner", { email: loc.user_email })}</p>` : ''}
                            <button onclick="window.openVendorCatalog('${loc.user}', '${loc.user_name?.replace(/'/g, "\\'") || t("map.popup.establishment")}')" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-1.5 px-3 rounded text-xs transition-colors shadow-sm">
                                <span style="display:flex; justify-content:center; align-items:center;">
                                    ${t("map.popup.catalogBtn")} <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                </span>
                            </button>
                        </div>
                    `);
                markers.push(marker);
            });

            if (markers.length > 0) {
                const group = L.featureGroup(markers);
                leafletMap.current.fitBounds(group.getBounds().pad(0.2));
            }
        } catch (error) {
            console.error(t("error.loadMarkers"), error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLocation = async () => {
        if (!selectedPosition) return;
        try {
            await api.post('geo/locations/', {
                latitude: selectedPosition.lat,
                longitude: selectedPosition.lng,
                description: locationDescription
            });
            toast.success(t("toast.save.success"));
            setIsEditModalOpen(false);
            setLocationDescription('');
            const L = (window as any).L;
            fetchAndRenderMarkers(L);
        } catch (error) {
            toast.error(t("toast.save.error"));
        }
    };

    return (
        <div className="p-6 h-full flex flex-col gap-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 dark:text-white uppercase tracking-tight"
                        dangerouslySetInnerHTML={{ __html: t("title") }} />
                    <p className="text-sm text-gray-500">
                        {user?.role === 'VENDEDOR' 
                            ? t('desc.seller')
                            : t('desc.client')
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        color={userLocation ? "success" : "primary"} 
                        size="sm" 
                        onClick={requestLocation} 
                        disabled={gettingLocation}
                    >
                        <div className="flex items-center gap-2">
                            {gettingLocation ? <Spinner size="sm"/> : <Icon icon="solar:map-point-wave-linear" height={20}/>}
                            <span>
                              {userLocation ? t("btn.location.active") : t("btn.location.inactive")}
                            </span>
                        </div>
                    </Button>
                    <Badge color="primary" icon={() => <Icon icon="solar:map-point-bold-duotone" className="mr-1" />} className="px-3 py-1">
                        {t("badge.vendor", { role: user?.role })}
                    </Badge>
                </div>
            </div>

            <Card className="flex-1 min-h-[500px] overflow-hidden p-0 relative border-0 shadow-2xl rounded-3xl">
                {loading && (
                    <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/60 backdrop-blur-sm">
                        <Spinner size="xl" />
                    </div>
                )}
                <div ref={mapRef} className="w-full h-full min-h-[500px] z-10" />
            </Card>

            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="md">
                <Modal.Header>{t("modal.newLocation.title")}</Modal.Header>
                <Modal.Body>
                   <div className="space-y-4">
                        <div className="flex gap-4 p-3 bg-gray-50 rounded-xl items-center border border-gray-100">
                            <Icon icon="solar:map-point-wave-bold-duotone" className="text-primary" height={24} />
                            <div>
                                <p className="text-xs font-bold text-gray-700">{t("modal.newLocation.selectedCoords")}</p>
                                <p className="text-[10px] text-gray-400">
                                    {t("modal.newLocation.latlng", {
                                        lat: selectedPosition?.lat?.toFixed(6) || "",
                                        lng: selectedPosition?.lng?.toFixed(6) || ""
                                    })}
                                </p>
                            </div>
                        </div>
                        <div>
                            <Label value={t("modal.newLocation.descLabel")} />
                            <TextInput 
                                placeholder={t("modal.newLocation.descPlaceholder")}
                                value={locationDescription}
                                onChange={(e) => setLocationDescription(e.target.value)}
                            />
                        </div>
                   </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" onClick={handleSaveLocation} disabled={!locationDescription}>{t("modal.newLocation.save")}</Button>
                    <Button color="gray" onClick={() => setIsEditModalOpen(false)}>{t("modal.newLocation.cancel")}</Button>
                </Modal.Footer>
            </Modal>

            <VendorCatalogModal 
                isOpen={isCatalogModalOpen}
                onClose={() => setIsCatalogModalOpen(false)}
                vendorId={selectedVendor?.id || null}
                vendorName={selectedVendor?.name}
            />
        </div>
    );
};

export default RoleBasedMap;