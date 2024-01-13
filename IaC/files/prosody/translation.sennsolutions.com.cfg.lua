plugin_paths = { "/usr/share/jitsi-meet/prosody-plugins/" }

-- domain mapper options, must at least have domain base set to use the mapper
muc_mapper_domain_base = "translation.sennsolutions.com";

external_service_secret = "CPUPW4cvwxtMR3Fu";
external_services = {
     { type = "stun", host = "translation.sennsolutions.com", port = 3478 },
     { type = "turn", host = "translation.sennsolutions.com", port = 3478, transport = "udp", secret = true, ttl = 86400, algorithm = "turn" },
     { type = "turns", host = "translation.sennsolutions.com", port = 5349, transport = "tcp", secret = true, ttl = 86400, algorithm = "turn" }
};

cross_domain_bosh = false;
consider_bosh_secure = true;
-- https_ports = { }; -- Remove this line to prevent listening on port 5284

-- by default prosody 0.12 sends cors headers, if you want to disable it uncomment the following (the config is available on 0.12.1)
--http_cors_override = {
--    bosh = {
--        enabled = false;
--    };
--    websocket = {
--        enabled = false;
--    };
--}

-- https://ssl-config.mozilla.org/#server=haproxy&version=2.1&config=intermediate&openssl=1.1.0g&guideline=5.4
ssl = {
    protocol = "tlsv1_2+";
    ciphers = "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384"
}

unlimited_jids = {
    "focus@auth.translation.sennsolutions.com",
    "jvb@auth.translation.sennsolutions.com"
}

VirtualHost "translation.sennsolutions.com"
    authentication = "token" -- "internal_hashed" -- "jitsi-anonymous" -- do not delete me
    app_id = "translation"
    app_secret = "translation_secret"
    allow_empty_token = true
    -- Properties below are modified by jitsi-meet-tokens package config
    -- and authentication above is switched to "token"
    --app_id="example_app_id"
    --app_secret="example_app_secret"
    -- Assign this host a certificate for TLS, otherwise it would use the one
    -- set in the global section (if any).
    -- Note that old-style SSL on port 5223 only supports one certificate, and will always
    -- use the global one.
    ssl = {
        key = "/etc/prosody/certs/translation.sennsolutions.com.key";
        certificate = "/etc/prosody/certs/translation.sennsolutions.com.crt";
    }
    av_moderation_component = "avmoderation.translation.sennsolutions.com"
    speakerstats_component = "speakerstats.translation.sennsolutions.com"
    conference_duration_component = "conferenceduration.translation.sennsolutions.com"
    end_conference_component = "endconference.translation.sennsolutions.com"
    -- we need bosh
    modules_enabled = {
        "bosh";
        "pubsub";
        "ping"; -- Enable mod_ping
        "speakerstats";
        "external_services";
        "conference_duration";
        "end_conference";
        "muc_lobby_rooms";
        "muc_breakout_rooms";
        "av_moderation";
        "room_metadata";
    }
    c2s_require_encryption = false
    lobby_muc = "lobby.translation.sennsolutions.com"
    breakout_rooms_muc = "breakout.translation.sennsolutions.com"
    room_metadata_component = "metadata.translation.sennsolutions.com"
    main_muc = "conference.translation.sennsolutions.com"
    -- muc_lobby_whitelist = { "recorder.translation.sennsolutions.com" } -- Here we can whitelist jibri to enter lobby enabled rooms

VirtualHost "guest.translation.sennsolutions.com"
    authentication = "jitsi-anonymous"
    c2s_require_encryption = false

Component "conference.translation.sennsolutions.com" "muc"
    restrict_room_creation = true
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        "muc_domain_mapper";
        "polls";
        --"token_verification";
        "muc_rate_limit";
    }
    admins = { "focus@auth.translation.sennsolutions.com" }
    muc_room_locking = false
    muc_room_default_public_jids = true

Component "breakout.translation.sennsolutions.com" "muc"
    restrict_room_creation = true
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        "muc_domain_mapper";
        "muc_rate_limit";
        "polls";
    }
    admins = { "focus@auth.translation.sennsolutions.com" }
    muc_room_locking = false
    muc_room_default_public_jids = true

-- internal muc component
Component "internal.auth.translation.sennsolutions.com" "muc"
    storage = "memory"
    modules_enabled = {
        "ping";
    }
    admins = { "focus@auth.translation.sennsolutions.com", "jvb@auth.translation.sennsolutions.com" }
    muc_room_locking = false
    muc_room_default_public_jids = true

VirtualHost "auth.translation.sennsolutions.com"
    ssl = {
        key = "/etc/prosody/certs/auth.translation.sennsolutions.com.key";
        certificate = "/etc/prosody/certs/auth.translation.sennsolutions.com.crt";
    }
    modules_enabled = {
        "limits_exception";
    }
    authentication = "internal_hashed"

-- Proxy to jicofo's user JID, so that it doesn't have to register as a component.
Component "focus.translation.sennsolutions.com" "client_proxy"
    target_address = "focus@auth.translation.sennsolutions.com"

Component "speakerstats.translation.sennsolutions.com" "speakerstats_component"
    muc_component = "conference.translation.sennsolutions.com"

Component "conferenceduration.translation.sennsolutions.com" "conference_duration_component"
    muc_component = "conference.translation.sennsolutions.com"

Component "endconference.translation.sennsolutions.com" "end_conference"
    muc_component = "conference.translation.sennsolutions.com"

Component "avmoderation.translation.sennsolutions.com" "av_moderation_component"
    muc_component = "conference.translation.sennsolutions.com"

Component "lobby.translation.sennsolutions.com" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true
    modules_enabled = {
        "muc_rate_limit";
        "polls";
    }

Component "metadata.translation.sennsolutions.com" "room_metadata_component"
    muc_component = "conference.translation.sennsolutions.com"
    breakout_rooms_component = "breakout.translation.sennsolutions.com"
