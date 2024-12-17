// will update to this
// https://www.algolia.com/doc/guides/building-search-ui/going-further/server-side-rendering/react/#with-nextjs

'use client'

import { ReactElement } from "react";
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, useHits, useInstantSearch, useSearchBox } from 'react-instantsearch';

const algoliaClient = algoliasearch(process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? '', process.env.NEXT_PUBLIC_ALGOLIA_SEARCHA_API_KEY ?? '');


type HitComponentProps = {
    onSelect: (city: string) => void
}


function HitComponent({ onSelect }: HitComponentProps): ReactElement {
    const { items } = useHits();
    const { clear } = useSearchBox();
    const { indexUiState } = useInstantSearch();
    if (indexUiState.query && indexUiState.query.length > 2) {
        return <div style={{ position: 'absolute', top: '40px', left: '0', backgroundColor: 'white', width: '100%', padding: '10px 20px', zIndex: '1', border: "solid 1px #eee", borderRadius: '5px' }}>
            {items.map((hit, idx) => {
                return <p key={idx} style={{ padding: "5px 0", cursor: 'pointer' }} onClick={() => {
                    onSelect(hit.Name);
                    clear();
                }}>{hit.Name}</p>;
            })}
        </div>
    }

    return <></>

}

type AlgoliaSearchProps = {
    onSelect: (city: string) => void
}

export function AlgoliaSearch({ onSelect }: AlgoliaSearchProps): ReactElement {
    return <div style={{ position: 'relative' }}>
        <InstantSearch searchClient={algoliaClient} indexName="cities">
            <SearchBox style={{ width: '768px' }} placeholder="Select City" resetIconComponent={() => <></>} />
            <HitComponent onSelect={onSelect} />
        </InstantSearch >
    </div >
}




