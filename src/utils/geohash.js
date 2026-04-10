const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encodeGeohash(latitude, longitude, precision = 6) {
  let idx = 0;
  let bit = 0;
  let evenBit = true;
  let geohash = '';

  let latMin = -90, latMax = 90;
  let lonMin = -180, lonMax = 180;

  while (geohash.length < precision) {
    if (evenBit) {
      const lonMid = (lonMin + lonMax) / 2;
      if (longitude > lonMid) {
        idx = (idx << 1) + 1;
        lonMin = lonMid;
      } else {
        idx = idx << 1;
        lonMax = lonMid;
      }
    } else {
      const latMid = (latMin + latMax) / 2;
      if (latitude > latMid) {
        idx = (idx << 1) + 1;
        latMin = latMid;
      } else {
        idx = idx << 1;
        latMax = latMid;
      }
    }
    evenBit = !evenBit;

    if (++bit === 5) {
      geohash += BASE32[idx];
      bit = 0;
      idx = 0;
    }
  }

  return geohash;
}

export function getNeighbors(geohash) {
  const neighbors = {
    right: { even: 'bc01fg45238967deuvhjyznpkmstqrwx', odd: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' },
    left: { even: '238967debc01fg45kmstqrwxuvhjyznp', odd: '14365h7k9dcfesgujnmqp0r2twvyx8zb' },
    top: { even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', odd: 'bc01fg45238967deuvhjyznpkmstqrwx' },
    bottom: { even: '14365h7k9dcfesgujnmqp0r2twvyx8zb', odd: '238967debc01fg45kmstqrwxuvhjyznp' }
  };

  const borders = {
    right: { even: 'bcfguvyz', odd: 'prxz' },
    left: { even: '0145hjnp', odd: '028b' },
    top: { even: 'prxz', odd: 'bcfguvyz' },
    bottom: { even: '028b', odd: '0145hjnp' }
  };

  const lastChar = geohash.slice(-1);
  const parent = geohash.slice(0, -1);
  const type = geohash.length % 2 ? 'odd' : 'even';

  const neighborHashes = [];

  ['right', 'left', 'top', 'bottom'].forEach(direction => {
    let neighbor = geohash;
    if (borders[direction][type].includes(lastChar) && parent) {
      neighbor = getNeighbor(parent, direction) + BASE32[neighbors[direction][type].indexOf(lastChar)];
    } else {
      neighbor = parent + BASE32[neighbors[direction][type].indexOf(lastChar)];
    }
    neighborHashes.push(neighbor);
  });

  // Add diagonal neighbors
  const [right, left, top, bottom] = neighborHashes;
  neighborHashes.push(getNeighbor(top, 'right'));
  neighborHashes.push(getNeighbor(top, 'left'));
  neighborHashes.push(getNeighbor(bottom, 'right'));
  neighborHashes.push(getNeighbor(bottom, 'left'));

  return neighborHashes;
}

function getNeighbor(geohash, direction) {
  const neighbors = {
    right: { even: 'bc01fg45238967deuvhjyznpkmstqrwx', odd: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy' },
    left: { even: '238967debc01fg45kmstqrwxuvhjyznp', odd: '14365h7k9dcfesgujnmqp0r2twvyx8zb' },
    top: { even: 'p0r21436x8zb9dcf5h7kjnmqesgutwvy', odd: 'bc01fg45238967deuvhjyznpkmstqrwx' },
    bottom: { even: '14365h7k9dcfesgujnmqp0r2twvyx8zb', odd: '238967debc01fg45kmstqrwxuvhjyznp' }
  };

  const borders = {
    right: { even: 'bcfguvyz', odd: 'prxz' },
    left: { even: '0145hjnp', odd: '028b' },
    top: { even: 'prxz', odd: 'bcfguvyz' },
    bottom: { even: '028b', odd: '0145hjnp' }
  };

  const lastChar = geohash.slice(-1);
  const parent = geohash.slice(0, -1);
  const type = geohash.length % 2 ? 'odd' : 'even';

  if (borders[direction][type].includes(lastChar) && parent) {
    return getNeighbor(parent, direction) + BASE32[neighbors[direction][type].indexOf(lastChar)];
  } else {
    return parent + BASE32[neighbors[direction][type].indexOf(lastChar)];
  }
}

export function buildGeohashIndex(pollingUnits, precision = 6) {
  const index = new Map();

  pollingUnits.forEach(unit => {
    const geohash = encodeGeohash(
      parseFloat(unit.latitude),
      parseFloat(unit.longitude),
      precision
    );
    
    if (!index.has(geohash)) {
      index.set(geohash, []);
    }
    index.get(geohash).push({ ...unit, geohash });
  });

  return index;
}

export function searchNearbyUnits(geohashIndex, latitude, longitude, precision = 6) {
  const centerGeohash = encodeGeohash(latitude, longitude, precision);
  const searchHashes = [centerGeohash, ...getNeighbors(centerGeohash)];
  
  const nearbyUnits = [];
  searchHashes.forEach(hash => {
    if (geohashIndex.has(hash)) {
      nearbyUnits.push(...geohashIndex.get(hash));
    }
  });

  return nearbyUnits;
}
