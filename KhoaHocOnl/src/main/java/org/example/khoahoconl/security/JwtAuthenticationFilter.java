package org.example.khoahoconl.security;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.lang.NonNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final static String TOKEN_PREFIX = "Bearer ";

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        String requestUri = request.getRequestURI();
        if (requestUri.startsWith("/api/auth/register") || requestUri.startsWith("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwt = getJwtFromRequest(request);

        if (StringUtils.hasText(jwt)) {
            try {
                if (tokenProvider.validateToken(jwt)) {
                    String username = tokenProvider.getUserNameFromToken(jwt);
                    UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (UsernameNotFoundException ex) {
                logger.error("User not found: {}", ex.getMessage());
            } catch (SignatureException ex) {
                logger.error("Invalid JWT signature: {}", ex.getMessage());
            } catch (MalformedJwtException ex) {
                logger.error("Invalid JWT token: {}", ex.getMessage());
            } catch (ExpiredJwtException ex) {
                logger.error("Expired JWT token: {}", ex.getMessage());
            } catch (UnsupportedJwtException ex) {
                logger.error("Unsupported JWT token: {}", ex.getMessage());
            } catch (IllegalArgumentException ex) {
                logger.error("JWT claims string is empty: {}", ex.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith(TOKEN_PREFIX)) {
            return bearerToken.substring(TOKEN_PREFIX.length());
        }
        return null;
    }
}